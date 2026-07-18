import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const repoRoot = path.resolve(siteRoot, '..');
export const wikiRoot = path.join(repoRoot, 'wiki');
export const schemaPath = path.join(repoRoot, 'db', 'schema.sql');
export const localDbDir = path.join(repoRoot, 'db', 'local');
export const databasePath = path.join(localDbDir, 'seraph-field.sqlite');
export const exportRoot = path.join(repoRoot, 'db', 'exports');
export const exportWikiRoot = path.join(exportRoot, 'wiki');
export const publicExportRoot = path.join(siteRoot, 'public', 'db', 'exports');

export const toPosix = (value) => value.split(path.sep).join('/');

export const fromWikiRelpathToJsonRelpath = (wikiRelpath) =>
  wikiRelpath.replace(/\.md$/i, '.json');

export const contentRelpathForWikiRelpath = (wikiRelpath) =>
  toPosix(path.join('db', 'exports', 'wiki', fromWikiRelpathToJsonRelpath(wikiRelpath)));
