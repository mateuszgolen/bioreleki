import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

// Adapter dla SQLite (Prisma 7 wymaga driver adaptera).
// Przejście na Postgres: podmień na @prisma/adapter-pg + zmień provider w schema.prisma.
const url = process.env.DATABASE_URL ?? "file:./dev.db";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
