// ─── Seed script ──────────────────────────────────────────────────────────────
// Runs against real Neon. Execute with:
//   npm run db:seed
//
// Requires DATABASE_URL in your environment (from .env.local).
// Safe to re-run — clears existing data first.

import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'
import { mockSeries, mockPosts, mockComments } from './mock'

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('❌  DATABASE_URL is not set. Add it to .env.local first.')
    process.exit(1)
  }

  console.log('🌱  Connecting to Neon...')
  const db = drizzle(neon(url), { schema })

  // Clear in reverse FK order
  console.log('🗑   Clearing existing data...')
  await db.delete(schema.comments)
  await db.delete(schema.posts)
  await db.delete(schema.series)

  // Seed series
  console.log('📚  Seeding series...')
  const insertedSeries = await db
    .insert(schema.series)
    .values(mockSeries.map(s => ({
      slug:        s.slug,
      title:       s.title,
      description: s.description,
    })))
    .returning()

  // Map old mock IDs → real DB IDs
  const seriesIdMap = new Map(
    mockSeries.map((s, i) => [s.id, insertedSeries[i].id])
  )

  // Seed posts
  console.log('📝  Seeding posts...')
  const insertedPosts = await db
    .insert(schema.posts)
    .values(mockPosts.map(p => ({
      slug:        p.slug,
      title:       p.title,
      description: p.description,
      content:     p.content,
      tags:        p.tags,
      seriesId:    p.seriesId ? seriesIdMap.get(p.seriesId) ?? null : null,
      seriesOrder: p.seriesOrder,
      readingTime: p.readingTime,
      published:   p.published,
    })))
    .returning()

  const postIdMap = new Map(
    mockPosts.map((p, i) => [p.id, insertedPosts[i].id])
  )

  // Seed comments
  console.log('💬  Seeding comments...')
  await db.insert(schema.comments).values(
    mockComments.map(c => ({
      postId:   postIdMap.get(c.postId) ?? insertedPosts[0].id,
      name:     c.name,
      email:    c.email,
      content:  c.content,
      approved: c.approved,
    }))
  )

  console.log(`
✅  Seed complete!
    ${insertedSeries.length} series
    ${insertedPosts.length} posts
    ${mockComments.length} comments
  `)
}

main().catch(e => { console.error(e); process.exit(1) })
