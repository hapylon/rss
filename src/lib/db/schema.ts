import { pgTable, timestamp, uuid, text, unique } from "drizzle-orm/pg-core"
import { time } from "node:console"

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    lastFetchedAt: timestamp("last_fetched_at"),
    name: text("name").notNull(),
    url: text("url").notNull().unique(),
    user_id: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
});

export const posts = pgTable("posts", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    title: text("title"),
    url: text("url").notNull().unique(),
    description: text("description"),
    publishedAt: text("published_at").notNull(),
    feed_id: uuid("feed_id").notNull(),
});

export const feed_follows = pgTable("feed_follows", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    user_id: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: 'cascade'}),
    feed_id: uuid("feed_id")
        .notNull()
        .references(() => feeds.id, { onDelete: 'cascade'}),
    },
    (table) => ({
        user_feed_unique: unique().on(table.user_id, table.feed_id),
    })
);