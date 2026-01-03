import { db } from "src/lib/db";
import { users, feeds } from "src/lib/db/schema";
import { readConfig } from "src/config";

export async function handlerArbitrary() {
    // const rows = await db.select().from(feeds);
    const url = readConfig().dbUrl
    console.log(url);

}