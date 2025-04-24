import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"
import { user, session, account, verification } from "./auth-schema";

export const schema = { user, session, account, verification };

export { user, session, account, verification };

// posts table
export const posts = sqliteTable(
  'posts',
  {
    id: text('id').primaryKey().notNull(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    slug: text('slug').notNull().unique(),
    createdAt: integer('createdAt', {mode: 'timestamp'})
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updatedAt', {mode: 'timestamp'})
      .notNull()
      .default(sql`(unixepoch())`),
  }
);

// This type will be used in our application code
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
