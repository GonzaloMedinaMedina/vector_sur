import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'
dotenv.config()

const isLocal = process.env.DATABASE_URL?.startsWith('file:')

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: isLocal ? 'sqlite' : 'turso',
  dbCredentials: isLocal
    ? { url: process.env.DATABASE_URL! }
    : { url: process.env.DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! },
} satisfies Config
