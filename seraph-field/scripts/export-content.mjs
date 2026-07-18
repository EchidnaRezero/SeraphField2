import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { documentFromMarkdown, slugify } from './lib/content-utils.mjs';
import { importWiki } from './import-wiki.mjs';
import {
  contentRelpathForWikiRelpath,
  exportRoot,
  exportWikiRoot,
  fromWikiRelpathToJsonRelpath,
  publicExportRoot,
  repoRoot,
  wikiRoot,
} from './lib/paths.mjs';
import { ensureDatabase, openDatabase } from './lib/sqlite-store.mjs';

const writeJson = async (target, value) => {
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

const getRows = (database, sql, ...params) => database.prepare(sql).all(...params);

const getPublishedRows = (database) =>
  getRows(
    database,
    `SELECT id, slug, title, summary, category, wiki_relpath, created_at, updated_at
     FROM documents
     WHERE status = 'published'
     ORDER BY slug`,
  );

const getTagsByDocument = (database) => {
  const rows = getRows(
    database,
    `SELECT d.slug, t.name
     FROM documents d
     JOIN document_tags dt ON dt.document_id = d.id
     JOIN tags t ON t.id = dt.tag_id
     WHERE d.status = 'published'
     ORDER BY t.name`,
  );

  return Map.groupBy(rows, (row) => row.slug);
};

const getGroupsByDocument = (database) => {
  const rows = getRows(
    database,
    `SELECT d.slug, g.id, g.title
     FROM documents d
     JOIN document_groups dg ON dg.document_id = d.id
     JOIN groups g ON g.id = dg.group_id
     WHERE d.status = 'published'
     ORDER BY g.sort_order, g.title`,
  );

  return Map.groupBy(rows, (row) => row.slug);
};

const getSeriesByDocument = (database) => {
  const rows = getRows(
    database,
    `SELECT d.slug, s.id, s.title, ds.series_order
     FROM documents d
     JOIN document_series ds ON ds.document_id = d.id
     JOIN series s ON s.id = ds.series_id
     WHERE d.status = 'published'`,
  );

  return new Map(
    rows.map((row) => [
      row.slug,
      {
        id: row.id,
        title: row.title,
        order: row.series_order,
      },
    ]),
  );
};

const getRepositoriesByDocument = (database) => {
  const rows = getRows(
    database,
    `SELECT d.slug, r.name, r.url
     FROM documents d
     JOIN repository_snapshots rs ON rs.source_document_id = d.id
     JOIN repositories r ON r.id = rs.repository_id
     WHERE d.status = 'published'
     ORDER BY r.name`,
  );

  return new Map(
    rows.map((row) => [
      row.slug,
      {
        owner: '',
        name: row.name,
        url: row.url ?? '',
      },
    ]),
  );
};

const hydrateDocuments = async (database) => {
  const rows = getPublishedRows(database);
  const tagsByDocument = getTagsByDocument(database);
  const groupsByDocument = getGroupsByDocument(database);
  const seriesByDocument = getSeriesByDocument(database);
  const repositoriesByDocument = getRepositoriesByDocument(database);

  return Promise.all(
    rows.map(async (row) => {
      const markdownPath = path.join(wikiRoot, row.wiki_relpath);
      const parsed = await documentFromMarkdown(markdownPath);
      return {
        slug: row.slug,
        title: row.title,
        summary: row.summary ?? '',
        category: row.category,
        layout: parsed.layout,
        role: parsed.role,
        wikiRelpath: row.wiki_relpath,
        contentRelpath: contentRelpathForWikiRelpath(row.wiki_relpath),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        tags: (tagsByDocument.get(row.slug) ?? []).map((item) => item.name),
        groups: (groupsByDocument.get(row.slug) ?? []).map((item) => item.title),
        series: seriesByDocument.get(row.slug),
        repository: repositoriesByDocument.get(row.slug),
        roadmap: parsed.roadmap,
        sections: [],
        content: {
          slug: row.slug,
          title: row.title,
          summary: row.summary ?? '',
          category: row.category,
          layout: parsed.layout,
          role: parsed.role,
          wikiRelpath: row.wiki_relpath,
          sections: parsed.sections,
        },
        searchText: [
          row.title,
          row.summary,
          row.category,
          ...(tagsByDocument.get(row.slug) ?? []).map((item) => item.name),
          ...(groupsByDocument.get(row.slug) ?? []).map((item) => item.title),
          ...(groupsByDocument.get(row.slug) ?? []).map((item) => item.id),
          seriesByDocument.get(row.slug)?.title,
          seriesByDocument.get(row.slug)?.id,
          parsed.markdown,
        ]
          .filter(Boolean)
          .join('\n'),
      };
    }),
  );
};

const exportLists = async (database, documents) => {
  const tags = getRows(
    database,
    `SELECT t.name, COALESCE(t.label, t.name) AS label, COUNT(dt.document_id) AS count
     FROM tags t
     JOIN document_tags dt ON dt.tag_id = t.id
     JOIN documents d ON d.id = dt.document_id
     WHERE d.status = 'published'
     GROUP BY t.id
     ORDER BY t.name`,
  );

  const groups = getRows(
    database,
    `SELECT g.id, g.title, g.description, g.sort_order AS sortOrder, COUNT(dg.document_id) AS count
     FROM groups g
     JOIN document_groups dg ON dg.group_id = g.id
     JOIN documents d ON d.id = dg.document_id
     WHERE d.status = 'published'
     GROUP BY g.id
     ORDER BY g.sort_order, g.title`,
  ).map((item) => ({
    ...item,
    documents: documents
      .filter((document) => document.groups.some((group) => slugify(group) === item.id))
      .map((document) => ({
        slug: document.slug,
        title: document.title,
        category: document.category,
      }))
      .sort((left, right) => left.title.localeCompare(right.title) || left.slug.localeCompare(right.slug)),
  }));

  const series = getRows(
    database,
    `SELECT s.id, s.title, s.description, s.sort_order AS sortOrder, COUNT(ds.document_id) AS count
     FROM series s
     JOIN document_series ds ON ds.series_id = s.id
     JOIN documents d ON d.id = ds.document_id
     WHERE d.status = 'published'
     GROUP BY s.id
     ORDER BY s.sort_order, s.title`,
  ).map((item) => ({
    ...item,
    documents: documents
      .filter((document) => document.series?.id === item.id)
      .map((document) => ({
        slug: document.slug,
        title: document.title,
        order: document.series.order,
      }))
      .sort((left, right) => left.order - right.order || left.slug.localeCompare(right.slug)),
  }));

  const repositories = getRows(
    database,
    `SELECT r.id, r.name, r.url, r.description, r.homepage_url AS homepageUrl,
            r.default_branch AS defaultBranch
     FROM repositories r
     WHERE EXISTS (
       SELECT 1
       FROM repository_snapshots rs
       JOIN documents d ON d.id = rs.source_document_id
       WHERE rs.repository_id = r.id AND d.status = 'published'
     )
     ORDER BY r.name`,
  ).map((repository) => ({
    ...repository,
    documents: documents
      .filter((document) => document.repository?.name === repository.name)
      .map((document) => ({ slug: document.slug, title: document.title })),
  }));

  await writeJson(path.join(exportRoot, 'tags.json'), tags);
  await writeJson(path.join(exportRoot, 'groups.json'), groups);
  await writeJson(path.join(exportRoot, 'series.json'), series);
  await writeJson(path.join(exportRoot, 'repositories.json'), repositories);
};

const exportSearchIndex = async (documents) => {
  const searchIndex = documents.map((document) => ({
    slug: document.slug,
    title: document.title,
    summary: document.summary,
    category: document.category,
    contentRelpath: document.contentRelpath,
    tags: document.tags,
    groups: document.groups,
    series: document.series?.title ?? '',
    repository: document.repository?.name ?? '',
    scopes: {
      title: document.title,
      summary: document.summary,
      tag: document.tags.join(' '),
      group: [...document.groups, ...document.groups.map((group) => slugify(group))].join(' '),
      series: [document.series?.title ?? '', document.series?.id ?? ''].filter(Boolean).join(' '),
      category: document.category,
    },
    text: document.searchText,
  }));

  await writeJson(path.join(exportRoot, 'search-index.json'), searchIndex);
};

const assertPublicExportSafety = async () => {
  const exportedFiles = await collectFiles(exportRoot);
  const forbiddenPatterns = [
    /(^|["'`\s])[A-Za-z]:[\\/]/m,
    /(^|["'`\s])raw[\\/]/i,
    /(^|["'`\s])draft[\\/]/i,
    /db[\\/]local/i,
    /seraph-field\.sqlite/i,
  ];

  for (const file of exportedFiles) {
    const text = await fs.readFile(file, 'utf8');
    const relative = path.relative(repoRoot, file);

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(text)) {
        throw new Error(`Public export safety check failed for ${relative}: ${pattern}`);
      }
    }
  }
};

const collectFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(absolute)));
    } else if (entry.isFile()) {
      files.push(absolute);
    }
  }

  return files;
};

export const exportContent = async () => {
  await ensureDatabase();
  await importWiki();
  await fs.rm(exportRoot, { recursive: true, force: true });
  await fs.mkdir(exportWikiRoot, { recursive: true });

  const database = openDatabase();
  try {
    const exports = await hydrateDocuments(database);
    const documents = exports.map(({ content, searchText, ...document }) => document);

    await writeJson(path.join(exportRoot, 'documents.json'), documents);
    await Promise.all(
      exports.map((item) =>
        writeJson(
          path.join(exportWikiRoot, fromWikiRelpathToJsonRelpath(item.wikiRelpath)),
          item.content,
        ),
      ),
    );
    await exportSearchIndex(exports);
    await exportLists(database, documents);
  } finally {
    database.close();
  }

  await assertPublicExportSafety();
  await fs.rm(publicExportRoot, { recursive: true, force: true });
  await fs.cp(exportRoot, publicExportRoot, { recursive: true });
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  exportContent()
    .then(async () => {
      const documents = JSON.parse(await fs.readFile(path.join(exportRoot, 'documents.json'), 'utf8'));
      console.log(`Exported ${documents.length} SQLite-backed wiki document(s).`);
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
