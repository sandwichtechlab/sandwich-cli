import { createHash, randomUUID } from "crypto";
import { getDb, closeDb } from "./db.js";

// ── Types ────────────────────────────────────────────────────────────────────

export interface StoreInput {
  title: string;
  content: string;
  tags?: string[];
  scope?: string;
}

export interface SearchInput {
  query: string;
  scope?: string;
  tags?: string[];
  limit?: number;
}

export interface UpdateInput {
  id: string;
  title?: string;
  content?: string;
  tags?: string[];
  scope?: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  scope: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreResult   { success: true; id: string; message: string }
export interface UpdateResult  { success: true; id: string; message: string }
export interface SearchResult  { results: KnowledgeItem[]; totalMatches: number; query: string }

interface Row {
  id: string; title: string; content: string;
  tags: string; scope: string; created_at: string; updated_at: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function normalizeTitle(t: string) { return t.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim(); }
function normalizeScope(s?: string) { return (s ?? "global").trim() || "global"; }
function normalizeTags(ts: string[]) { return [...new Set(ts.map((t) => t.toLowerCase().trim()).filter(Boolean))].sort(); }
function hashContent(c: string) { return createHash("sha256").update(c.trim()).digest("hex"); }
function toItem(row: Row): KnowledgeItem {
  return { id: row.id, title: row.title, content: row.content, tags: JSON.parse(row.tags) as string[], scope: row.scope, createdAt: row.created_at, updatedAt: row.updated_at };
}

// ── Store ─────────────────────────────────────────────────────────────────────

export function storeKnowledge(input: StoreInput): StoreResult {
  if (!input.title?.trim()) throw new Error("Title is required");
  if (!input.content?.trim()) throw new Error("Content is required");
  if (input.title.trim().length > 100) throw new Error("Title max 100 chars");
  if (input.content.trim().length > 5000) throw new Error("Content max 5000 chars");

  const db = getDb();
  const scope = normalizeScope(input.scope);
  const normalizedTitle = normalizeTitle(input.title);
  const tags = JSON.stringify(normalizeTags(input.tags ?? []));
  const contentHash = hashContent(input.content);
  const id = randomUUID();
  const now = new Date().toISOString();

  const dup = db.prepare("SELECT id FROM knowledge WHERE normalized_title = ? AND scope = ?").get(normalizedTitle, scope) as { id: string } | undefined;
  if (dup) throw new Error(`Duplicate title (id: ${dup.id})`);

  const dupHash = db.prepare("SELECT id FROM knowledge WHERE content_hash = ? AND scope = ?").get(contentHash, scope) as { id: string } | undefined;
  if (dupHash) throw new Error(`Duplicate content (id: ${dupHash.id})`);

  db.prepare(`INSERT INTO knowledge (id,title,content,tags,scope,normalized_title,content_hash,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)`)
    .run(id, input.title.trim(), input.content.trim(), tags, scope, normalizedTitle, contentHash, now, now);

  return { success: true, id, message: "Knowledge stored successfully" };
}

// ── Search ────────────────────────────────────────────────────────────────────

export function searchKnowledge(input: SearchInput): SearchResult {
  if (!input.query?.trim() || input.query.trim().length < 3) throw new Error("Query must be at least 3 characters");

  const db = getDb();
  const limit = Math.min(input.limit ?? 5, 20);
  const scope = input.scope ? normalizeScope(input.scope) : undefined;

  // Build FTS query — escape special chars
  const ftsQuery = input.query.trim().replace(/["]/g, '""').replace(/\*/g, "");

  let rows: Row[];
  try {
    const scopeClause = scope ? "AND k.scope = ?" : "";
    const params: unknown[] = [`"${ftsQuery}"*`, limit * 2];
    if (scope) params.splice(1, 0, scope);
    rows = db.prepare(`
      SELECT k.id, k.title, k.content, k.tags, k.scope, k.created_at, k.updated_at
      FROM knowledge k
      JOIN knowledge_fts f ON k.rowid = f.rowid
      WHERE knowledge_fts MATCH ? ${scopeClause}
      ORDER BY bm25(knowledge_fts, 10, 5, 1)
      LIMIT ?
    `).all(...params) as Row[];
  } catch {
    // fallback to recent items
    const params: unknown[] = scope ? [scope, limit] : [limit];
    const clause = scope ? "WHERE scope = ?" : "";
    rows = db.prepare(`SELECT id,title,content,tags,scope,created_at,updated_at FROM knowledge ${clause} ORDER BY updated_at DESC LIMIT ?`).all(...params) as Row[];
  }

  const results = rows.slice(0, limit).map(toItem);
  return { results, totalMatches: rows.length, query: input.query };
}

// ── Update ────────────────────────────────────────────────────────────────────

export function updateKnowledge(input: UpdateInput): UpdateResult {
  const db = getDb();
  const row = db.prepare("SELECT * FROM knowledge WHERE id = ?").get(input.id) as Row | undefined;
  if (!row) throw new Error(`Knowledge item not found: ${input.id}`);

  const now = new Date().toISOString();
  const title = input.title?.trim() ?? row.title;
  const content = input.content?.trim() ?? row.content;
  const tags = input.tags ? JSON.stringify(normalizeTags(input.tags)) : row.tags;
  const scope = input.scope ? normalizeScope(input.scope) : row.scope;

  db.prepare(`UPDATE knowledge SET title=?,content=?,tags=?,scope=?,normalized_title=?,content_hash=?,updated_at=? WHERE id=?`)
    .run(title, content, tags, scope, normalizeTitle(title), hashContent(content), now, input.id);

  return { success: true, id: input.id, message: "Knowledge updated successfully" };
}

// ── Delete ────────────────────────────────────────────────────────────────────

export interface DeleteInput { id: string }
export interface DeleteResult { success: true; id: string; message: string }

export function deleteKnowledge(input: DeleteInput): DeleteResult {
  const db = getDb();
  const row = db.prepare("SELECT id FROM knowledge WHERE id = ?").get(input.id) as { id: string } | undefined;
  if (!row) throw new Error(`Knowledge item not found: ${input.id}`);

  db.prepare("DELETE FROM knowledge WHERE id = ?").run(input.id);
  return { success: true, id: input.id, message: "Knowledge deleted successfully" };
}

export { closeDb };
