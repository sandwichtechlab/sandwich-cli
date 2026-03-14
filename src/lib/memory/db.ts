import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { homedir } from "os";

export const DEFAULT_DB_PATH = join(homedir(), ".sandwich", "memory.db");

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS knowledge (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL CHECK (length(title) <= 100),
  content TEXT NOT NULL CHECK (length(content) <= 5000),
  tags TEXT NOT NULL DEFAULT '[]',
  scope TEXT NOT NULL DEFAULT 'global',
  normalized_title TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (normalized_title, scope),
  UNIQUE (content_hash, scope)
);

CREATE VIRTUAL TABLE IF NOT EXISTS knowledge_fts USING fts5(
  title, content, tags,
  content='knowledge',
  content_rowid='rowid',
  tokenize='porter unicode61'
);

CREATE TRIGGER IF NOT EXISTS knowledge_ai AFTER INSERT ON knowledge BEGIN
  INSERT INTO knowledge_fts(rowid, title, content, tags) VALUES (NEW.rowid, NEW.title, NEW.content, NEW.tags);
END;
CREATE TRIGGER IF NOT EXISTS knowledge_ad AFTER DELETE ON knowledge BEGIN
  INSERT INTO knowledge_fts(knowledge_fts, rowid, title, content, tags) VALUES ('delete', OLD.rowid, OLD.title, OLD.content, OLD.tags);
END;
CREATE TRIGGER IF NOT EXISTS knowledge_au AFTER UPDATE ON knowledge BEGIN
  INSERT INTO knowledge_fts(knowledge_fts, rowid, title, content, tags) VALUES ('delete', OLD.rowid, OLD.title, OLD.content, OLD.tags);
  INSERT INTO knowledge_fts(rowid, title, content, tags) VALUES (NEW.rowid, NEW.title, NEW.content, NEW.tags);
END;

CREATE INDEX IF NOT EXISTS idx_knowledge_scope ON knowledge(scope);
`;

let instance: Database.Database | null = null;

export function getDb(dbPath = DEFAULT_DB_PATH): Database.Database {
  if (instance) return instance;
  mkdirSync(dirname(dbPath), { recursive: true });
  instance = new Database(dbPath);
  instance.pragma("journal_mode = WAL");
  instance.pragma("foreign_keys = ON");
  instance.pragma("synchronous = NORMAL");
  instance.exec(MIGRATION_SQL);
  return instance;
}

export function closeDb(): void {
  try {
    if (instance?.open) instance.close();
  } catch {
    // Already closed or in invalid state — ignore
  }
  instance = null;
}
