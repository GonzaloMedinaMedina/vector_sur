import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

type DB = ReturnType<typeof drizzle<typeof schema>>
const globalForDb = globalThis as unknown as { db: DB }

function createDb(): DB {
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
  return drizzle(client, { schema })
}

export const db = globalForDb.db ?? createDb()

if (process.env.NODE_ENV !== 'production') globalForDb.db = db
