import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";
import { setUser, readConfig } from "../../../config.js";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name }).returning();
  return result;
}

export async function registerUser(name: string) {
  if (!name) {
    throw new Error("Name is required");
  }
  const [existing] = await db.select().from(users).where(eq(users.name, name));
  if (existing) {
    throw new Error("User already registered");
  }
  const newUser = await createUser(name);
  setUser(name);
  console.log(`User "${name}" was created:`);
  console.log(newUser);
  return newUser;
}

export async function getUser(name: string) {
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.name, name));

  if (!existing) {
    throw new Error("User not registered");
  } else {
    return existing;
  }
}
export type User = typeof users.$inferSelect;

export async function resetUsers(): Promise<void> {
  await db.delete(users);
  console.log("All records deleted from the 'users' table.");
//   await db.execute(sql`DROP TABLE IF EXISTS feeds CASCADE`);
//   await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
//   console.log("All tables dropped.");
// }
}
export async function getUsers() {
    return await db.select().from(users);
}
