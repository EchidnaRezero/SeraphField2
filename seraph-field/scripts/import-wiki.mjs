import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { documentFromMarkdown, walkMarkdown } from './lib/content-utils.mjs';
import {
  ensureDatabase,
  markArchivedDocuments,
  openDatabase,
  recordDocumentEvent,
  upsertDocument,
} from './lib/sqlite-store.mjs';
import { wikiRoot } from './lib/paths.mjs';

const IMPORT_ACTOR = 'import-wiki';

const recordImportEvent = (database, { documentId, eventType, note }) => {
  recordDocumentEvent(database, {
    documentId,
    eventType,
    actor: IMPORT_ACTOR,
    note,
  });
};

export const importWiki = async () => {
  await ensureDatabase();

  try {
    await fs.access(wikiRoot);
  } catch {
    const database = openDatabase();
    database.exec('BEGIN');
    try {
      const archivedDocuments = markArchivedDocuments(database, []);
      for (const document of archivedDocuments) {
        recordImportEvent(database, {
          documentId: document.documentId,
          eventType: 'archived',
          note: `wiki missing: ${document.wikiRelpath}`,
        });
      }
      database.exec('COMMIT');
    } catch (error) {
      database.exec('ROLLBACK');
      throw error;
    } finally {
      database.close();
    }
    return [];
  }

  const markdownFiles = (await walkMarkdown(wikiRoot)).sort();
  const documents = await Promise.all(markdownFiles.map(documentFromMarkdown));
  const database = openDatabase();

  database.exec('BEGIN');
  try {
    for (const document of documents) {
      const result = upsertDocument(database, document);
      recordImportEvent(database, {
        documentId: result.documentId,
        eventType: result.eventType,
        note: `wiki import: ${document.wikiRelpath}`,
      });
    }
    const archivedDocuments = markArchivedDocuments(
      database,
      documents.map((document) => document.wikiRelpath),
    );
    for (const document of archivedDocuments) {
      recordImportEvent(database, {
        documentId: document.documentId,
        eventType: 'archived',
        note: `wiki missing: ${document.wikiRelpath}`,
      });
    }
    database.exec('COMMIT');
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  } finally {
    database.close();
  }

  return documents;
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  importWiki()
    .then((documents) => {
      console.log(`Imported ${documents.length} wiki document(s) into SQLite.`);
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
