import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core"
import { time } from "node:console"

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("update_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    name: text("name").notNull().unique(),
});

