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

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.name, name));

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

export async function deleteUsers(): Promise<void> {
  await db.delete(users);
  console.log("All records deleted from the 'users' table.");
}

export async function getUsers(): Promise<void> {
  const name_array = await db
    .select({field1: users.name})
    .from(users);
  if (name_array.length < 1) {
    throw new Error("No users registered");
  };
  const current_user_name = readConfig().currentUserName;
  const names: string[] = name_array.map(item => item.field1);
  const names_marked: string[] = names.map(name => {
  if (name === current_user_name) {
    return `* ${name} (current)`; 
}
  return `* ${name}`;
});
  for (let i = 0; i < names_marked.length; i++) {
    console.log(names_marked[i]);
  }
}
