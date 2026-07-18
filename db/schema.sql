PRAGMA foreign_keys = ON;

CREATE TABLE documents (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT,
  category TEXT NOT NULL CHECK (category IN ('THEORY', 'PAPER', 'REPO', 'IMPLEMENT', 'PROFILE')),
  wiki_relpath TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'archived')),
  content_hash TEXT,
  created_by TEXT,
  updated_by TEXT,
  created_record_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_record_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_created_at ON documents(created_at);
CREATE INDEX idx_documents_updated_at ON documents(updated_at);

CREATE TABLE tags (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  label TEXT
);

CREATE TABLE document_tags (
  document_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (document_id, tag_id),
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE INDEX idx_document_tags_tag_id ON document_tags(tag_id);

CREATE TABLE series (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER
);

CREATE TABLE document_series (
  document_id INTEGER PRIMARY KEY,
  series_id TEXT NOT NULL,
  series_order INTEGER NOT NULL,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (series_id) REFERENCES series(id) ON DELETE CASCADE
);

CREATE INDEX idx_document_series_series_id ON document_series(series_id, series_order);

CREATE TABLE groups (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER
);

CREATE TABLE document_groups (
  document_id INTEGER NOT NULL,
  group_id TEXT NOT NULL,
  PRIMARY KEY (document_id, group_id),
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

CREATE INDEX idx_document_groups_group_id ON document_groups(group_id);

CREATE TABLE repositories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  url TEXT,
  description TEXT,
  homepage_url TEXT,
  default_branch TEXT
);

CREATE TABLE repository_snapshots (
  id INTEGER PRIMARY KEY,
  repository_id INTEGER NOT NULL,
  version TEXT,
  checked_at TEXT NOT NULL,
  source_document_id INTEGER,
  source_note TEXT,
  created_record_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id) ON DELETE CASCADE,
  FOREIGN KEY (source_document_id) REFERENCES documents(id) ON DELETE SET NULL
);

CREATE INDEX idx_repository_snapshots_repo_checked
  ON repository_snapshots(repository_id, checked_at DESC);

CREATE TABLE document_events (
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

CREATE INDEX idx_document_events_document_id ON document_events(document_id, event_at DESC);
CREATE INDEX idx_document_events_event_at ON document_events(event_at DESC);

-- Suggested public JSON exports derived from this schema:
-- - db/exports/documents.json
-- - db/exports/search-index.json
-- - db/exports/tags.json
-- - db/exports/series.json
-- - db/exports/groups.json
-- - db/exports/repositories.json
