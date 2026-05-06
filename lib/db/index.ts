import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// neon() returns a tagged-template SQL executor over HTTPS —
// no persistent connection, perfect for serverless/edge.
// DATABASE_URL = postgres://user:pass@host.neon.tech/dbname?sslmode=require
function createDb() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('Missing env: DATABASE_URL')
  return drizzle(neon(url), { schema })
}

declare global {
  // eslint-disable-next-line no-var
  var _db: ReturnType<typeof createDb> | undefined
}

export const db = globalThis._db ?? createDb()
if (process.env.NODE_ENV !== 'production') globalThis._db = db

export { schema }
