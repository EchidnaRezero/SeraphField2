import fs from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';
import { databasePath, localDbDir, schemaPath } from './paths.mjs';
import { slugify } from './content-utils.mjs';

export const openDatabase = () => new DatabaseSync(databasePath);

export const ensureDatabase = async () => {
  await fs.mkdir(localDbDir, { recursive: true });
  const database = openDatabase();
  const hasDocumentsTable = database
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'documents'")
    .get();

  if (!hasDocumentsTable) {
    const schema = await fs.readFile(schemaPath, 'utf8');
    database.exec(schema);
  }

  ensureDocumentEventsTable(database);
  database.exec('PRAGMA foreign_keys = ON');
  database.close();
};

const nullable = (value) => (value === undefined || value === '' ? null : value);

const getDocumentId = (database, slug) =>
  database.prepare('SELECT id FROM documents WHERE slug = ?').get(slug)?.id;

const getDocumentState = (database, slug) =>
  database.prepare('SELECT id, status FROM documents WHERE slug = ?').get(slug);

const ensureDocumentEventsTable = (database) => {
  database.exec(`
    CREATE TABLE IF NOT EXISTS document_events (
      id INTEGER PRIMARY KEY,
      document_id INTEGER,
      event_type TEXT NOT NULL CHECK (
        event_type IN (
          'draft_created',
          'review_requested',
          'review_passed',
          'review_failed',
          'published',
          'updated',
          'archived'
        )
      ),
      actor TEXT,
      draft_relpath TEXT,
      note TEXT,
      event_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_document_events_document_id
      ON document_events(document_id, event_at DESC);
    CREATE INDEX IF NOT EXISTS idx_document_events_event_at
      ON document_events(event_at DESC);
  `);
};

export const recordDocumentEvent = (
  database,
  { documentId, eventType, actor, draftRelpath, note },
) => {
  database
    .prepare(
      `INSERT INTO document_events (
         document_id,
         event_type,
         actor,
         draft_relpath,
         note
       )
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(
      nullable(documentId),
      eventType,
      nullable(actor),
      nullable(draftRelpath),
      nullable(note),
    );
};

const upsertTag = (database, name) => {
  database
    .prepare(
      `INSERT INTO tags (name, label)
       VALUES (?, ?)
       ON CONFLICT(name) DO UPDATE SET label = excluded.label`,
    )
    .run(name, name);
  return database.prepare('SELECT id FROM tags WHERE name = ?').get(name).id;
};

const upsertGroup = (database, title) => {
  const id = slugify(title);
  database
    .prepare(
      `INSERT INTO groups (id, title)
       VALUES (?, ?)
       ON CONFLICT(id) DO UPDATE SET title = excluded.title`,
    )
    .run(id, title);
  return id;
};

const upsertSeries = (database, series) => {
  database
    .prepare(
      `INSERT INTO series (id, title, description, sort_order)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         title = excluded.title,
         description = COALESCE(excluded.description, series.description),
         sort_order = COALESCE(excluded.sort_order, series.sort_order)`,
    )
    .run(series.id, series.title, nullable(series.description), nullable(series.sortOrder));
};

const upsertRepository = (database, repository, documentId) => {
  database
    .prepare(
      `INSERT INTO repositories (name, url, description, homepage_url, default_branch)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(name) DO UPDATE SET
         url = COALESCE(excluded.url, repositories.url),
         description = COALESCE(excluded.description, repositories.description),
         homepage_url = COALESCE(excluded.homepage_url, repositories.homepage_url),
         default_branch = COALESCE(excluded.default_branch, repositories.default_branch)`,
    )
    .run(
      repository.name,
      nullable(repository.url),
      nullable(repository.description),
      nullable(repository.homepageUrl),
      nullable(repository.defaultBranch),
    );

  const repositoryId = database
    .prepare('SELECT id FROM repositories WHERE name = ?')
    .get(repository.name).id;

  database
    .prepare(
      `DELETE FROM repository_snapshots
       WHERE repository_id = ? AND source_document_id = ?`,
    )
    .run(repositoryId, documentId);

  database
    .prepare(
      `INSERT INTO repository_snapshots (
         repository_id,
         version,
         checked_at,
         source_document_id,
         source_note
       )
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(
      repositoryId,
      nullable(repository.version),
      repository.checkedAt,
      documentId,
      'wiki frontmatter',
    );
};

export const upsertDocument = (database, document) => {
  const existingDocument = getDocumentState(database, document.slug);

  database
    .prepare(
      `INSERT INTO documents (
         slug,
         title,
         summary,
         category,
         wiki_relpath,
         created_at,
         updated_at,
         status,
         content_hash,
         updated_record_at
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?, CURRENT_TIMESTAMP)
       ON CONFLICT(slug) DO UPDATE SET
         title = excluded.title,
         summary = excluded.summary,
         category = excluded.category,
         wiki_relpath = excluded.wiki_relpath,
         created_at = excluded.created_at,
         updated_at = excluded.updated_at,
         status = 'published',
         content_hash = excluded.content_hash,
         updated_record_at = CURRENT_TIMESTAMP`,
    )
    .run(
      document.slug,
      document.title,
      document.summary,
      document.category,
      document.wikiRelpath,
      document.createdAt,
      document.updatedAt,
      document.contentHash,
    );

  const documentId = getDocumentId(database, document.slug);

  database.prepare('DELETE FROM document_tags WHERE document_id = ?').run(documentId);
  for (const tag of document.tags) {
    const tagId = upsertTag(database, tag);
    database
      .prepare('INSERT OR IGNORE INTO document_tags (document_id, tag_id) VALUES (?, ?)')
      .run(documentId, tagId);
  }

  database.prepare('DELETE FROM document_groups WHERE document_id = ?').run(documentId);
  for (const group of document.groups) {
    const groupId = upsertGroup(database, group);
    database
      .prepare('INSERT OR IGNORE INTO document_groups (document_id, group_id) VALUES (?, ?)')
      .run(documentId, groupId);
  }

  database.prepare('DELETE FROM document_series WHERE document_id = ?').run(documentId);
  if (document.series) {
    upsertSeries(database, document.series);
    database
      .prepare(
        `INSERT INTO document_series (document_id, series_id, series_order)
         VALUES (?, ?, ?)`,
      )
      .run(documentId, document.series.id, document.series.order);
  }

  if (document.repository) {
    upsertRepository(database, document.repository, documentId);
  }

  return {
    documentId,
    eventType: existingDocument ? 'updated' : 'published',
    previousStatus: existingDocument?.status ?? null,
  };
};

export const markArchivedDocuments = (database, wikiRelpaths) => {
  if (wikiRelpaths.length === 0) {
    const archivedDocuments = database
      .prepare(
        `SELECT id AS documentId, wiki_relpath AS wikiRelpath
         FROM documents
         WHERE status != 'archived'`,
      )
      .all();

    database
      .prepare("UPDATE documents SET status = 'archived' WHERE status != 'archived'")
      .run();
    return archivedDocuments;
  }

  const placeholders = wikiRelpaths.map(() => '?').join(', ');
  const archivedDocuments = database
    .prepare(
      `SELECT id AS documentId, wiki_relpath AS wikiRelpath
       FROM documents
       WHERE status != 'archived' AND wiki_relpath NOT IN (${placeholders})`,
    )
    .all(...wikiRelpaths);

  database
    .prepare(
      `UPDATE documents
       SET status = 'archived'
       WHERE status != 'archived' AND wiki_relpath NOT IN (${placeholders})`,
    )
    .run(...wikiRelpaths);

  return archivedDocuments;
};
