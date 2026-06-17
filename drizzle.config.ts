import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'
dotenv.config({ path: ".env" });

const isLocal = process.env.DB_VECTOR_SUR_TURSO_DATABASE_URL?.startsWith('file:')

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: isLocal ? 'sqlite' : 'turso',
  dbCredentials: isLocal
    ? { url: process.env.DB_VECTOR_SUR_TURSO_DATABASE_URL! }
    : { url: process.env.DB_VECTOR_SUR_TURSO_DATABASE_URL!, authToken: process.env.DB_VECTOR_SUR_TURSO_AUTH_TOKEN! },
} satisfies Config
