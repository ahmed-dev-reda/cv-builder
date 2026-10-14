import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

/**
 * Prisma 7 client over Neon PostgreSQL (replaces raw `sql` queries).
 *
 * Schema lives in prisma/schema.prisma and mirrors the existing
 * `users`/`cvs` tables 1:1, so no data migration is needed.
 * A single process-wide instance is shared via globalThis so Next.js
 * dev hot-reloads don't exhaust the connection pool.
 */

function createClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set — copy .env.example to .env and fill it in",
    );
  }
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
