import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";
import { setUser } from "../../../config.js";

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

// export async function registerUser(name: string) {
//   console.log("registerUser called with:", name);

//   try {
//     const rows = await db.select().from(users);
//     console.log("rows from users table:", rows);
//   } catch (err) {
//     console.error("DB error in registerUser:", err);
//   }

//   console.log("about to call setUser");
//   setUser(name);
//   console.log("setUser finished");

//   return;
// }



// import { setUser } from "../../../config.js";
// import { db } from "..";
// import { users } from "../schema";
// import { eq } from "drizzle-orm";

// export async function createUser(name: string) {
//   const [result] = await db.insert(users).values({ name: name }).returning();
//   return result;
// }

// export async function registerUser(name_: string) {
//     console.log("registerUser called with:", name_);
    
//     if (!name_) {
//         throw new Error("Name is required");
//     }
//     const [existing] = await db
//     .select()
//     .from(users)
//     .where(eq(users.name, name_));

//     console.log("existing user:", existing);

//     if (existing) {
//         throw new Error("User already registered")
//     }
//     const newUser = await createUser(name_)

//     console.log("created user:", newUser);

//     setUser(name_);

//     console.log("setUser just called with:", name_);
    
//     console.log(`User "${name_}" was created: `);
//     console.log(newUser);
//     return newUser;
// }

