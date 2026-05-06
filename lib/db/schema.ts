import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// ─── series ──────────────────────────────────────────────────────────────────
export const series = pgTable('series', {
  id:          serial('id').primaryKey(),
  slug:        text('slug').notNull().unique(),
  title:       text('title').notNull(),
  description: text('description'),
  createdAt:   timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
})

// ─── posts ───────────────────────────────────────────────────────────────────
// tags: native Postgres text[] — no JSON parsing needed
export const posts = pgTable('posts', {
  id:          serial('id').primaryKey(),
  slug:        text('slug').notNull().unique(),
  title:       text('title').notNull(),
  description: text('description').notNull().default(''),
  content:     text('content').notNull().default(''),
  tags:        text('tags').array().notNull().default(sql`'{}'::text[]`),
  seriesId:    integer('series_id').references(() => series.id, { onDelete: 'set null' }),
  seriesOrder: integer('series_order'),
  readingTime: text('reading_time').notNull().default('1 min read'),
  published:   boolean('published').notNull().default(false),
  createdAt:   timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt:   timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
})

// ─── comments ────────────────────────────────────────────────────────────────
export const comments = pgTable('comments', {
  id:        serial('id').primaryKey(),
  postId:    integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  name:      text('name').notNull(),
  email:     text('email').notNull(),
  content:   text('content').notNull(),
  approved:  boolean('approved').notNull().default(false),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
})

// ─── inferred types ───────────────────────────────────────────────────────────
export type Post       = typeof posts.$inferSelect
export type NewPost    = typeof posts.$inferInsert
export type Series     = typeof series.$inferSelect
export type NewSeries  = typeof series.$inferInsert
export type Comment    = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert
