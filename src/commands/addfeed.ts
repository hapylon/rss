import { readConfig } from "src/config";
import { db } from "src/lib/db";
import { users, feeds } from "src/lib/db/schema";
import { eq } from "drizzle-orm";
import { addfeed, createFeed, printFeed } from "src/lib/rss";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length < 2) {
        throw new Error("Usage: addfeed <feed name> <feed url>");
    }
    const feedName = args[0];
    const feedURL = args[1];
    const cfg = readConfig();
    const current_name = cfg.currentUserName;
    const [user_row] = await db
    // .select({id: users.id})
    .select()
    .from(users)
    .where(eq(users.name, current_name));
    if (!user_row) {
        throw new Error(`current user not found  ${current_name}`);
    }
    const user_uuid = user_row.id;
    
    const new_feed = await createFeed(feedName, feedURL, user_uuid);
    try {
        const [insertedFeed] = await db.insert(feeds).values(new_feed).returning();
        await printFeed(insertedFeed, user_row);
    } catch (err: any) {
        console.error("Failed to insert feed:", err);
        throw err;
    }
} 
//     await addfeed(new_feed);

//     await printFeed(new_feed, user_row);
// }

