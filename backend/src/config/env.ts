import "dotenv/config";

// Prisma's schema.prisma reads DATABASE_URL/DIRECT_URL directly from process.env at
// PrismaClient construction time. Alias Vercel's Supabase-integration variable names onto
// those before any Prisma import happens, so the integration's auto-injected credentials
// (which never need to be typed by hand) satisfy the schema without renaming it.
if (!process.env.DATABASE_URL && process.env.POSTGRES_PRISMA_URL) {
  process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL;
}
if (!process.env.DIRECT_URL && process.env.POSTGRES_URL_NON_POOLING) {
  process.env.DIRECT_URL = process.env.POSTGRES_URL_NON_POOLING;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Vercel's native Supabase integration injects POSTGRES_PRISMA_URL (pooled) and
 * POSTGRES_URL_NON_POOLING (direct) automatically, without the DB password ever being
 * typed manually. Fall back to those names so DATABASE_URL/DIRECT_URL don't have to be
 * set by hand when that integration is enabled.
 */
function requiredWithFallback(primary: string, fallback: string): string {
  const value = process.env[primary] ?? process.env[fallback];
  if (!value) {
    throw new Error(`Missing required environment variable: ${primary} (or fallback ${fallback})`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: requiredWithFallback("DATABASE_URL", "POSTGRES_PRISMA_URL"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
};
