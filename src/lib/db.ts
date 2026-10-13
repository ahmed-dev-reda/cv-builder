import { neon } from "@neondatabase/serverless";

/**
 * Neon PostgreSQL client — replaces the old better-sqlite3 module.
 *
 * The database URL comes from DATABASE_URL (see .env.example). Tables are
 * created automatically on first use via initDb().
 */

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set — copy .env.example to .env and fill it in");
}

export const sql = neon(process.env.DATABASE_URL);

let initPromise: Promise<void> | null = null;

/**
 * Create tables and indexes if they don't exist yet (idempotent).
 * Cached so the DDL only runs once per process.
 */
export function initDb(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          name TEXT DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS cvs (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name TEXT NOT NULL DEFAULT 'Untitled CV',
          data JSONB NOT NULL,
          is_default BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs(user_id)`;
    })();
  }
  return initPromise;
}

export default initDb;