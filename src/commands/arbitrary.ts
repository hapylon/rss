import { db } from "src/lib/db";
import { users, feeds } from "src/lib/db/schema";


export async function handlerArbitrary() {
    const rows = await db.select().from(feeds);
    console.log(rows);
}