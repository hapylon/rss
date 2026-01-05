import { readConfig } from "src/config";
import { db } from "src/lib/db";
import { users, feeds } from "src/lib/db/schema";
import { eq } from "drizzle-orm";
import { addfeed, createFeed, printFeed, User } from "src/lib/rss";
import { createFeedFollow, urlToFeedId } from "src/lib/db/queries/feedslist";

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    console.log("addfeed args", args)
    if (args.length < 2) {
        throw new Error("Usage: addfeed <feed name> <feed url>");
    }
    const feedName = args[0];
    const feedURL = args[1];
    // const cfg = readConfig();
    // const current_name = cfg.currentUserName;
    // const [user_row] = await db
    // // .select({id: users.id})
    // .select()
    // .from(users)
    // .where(eq(users.name, current_name));
    // if (!user_row) {
    //     throw new Error(`current user not found  ${current_name}`);
    // }
    // const user_uuid = user_row.id;
    
    const new_feed = await createFeed(feedName, feedURL, user.id);
    try {
        const [insertedFeed] = await db.insert(feeds).values(new_feed).returning();
        // await printFeed(insertedFeed, user_row);
        const feedId = await urlToFeedId(feedURL);
        const new_ff = await createFeedFollow(user.id, feedId);
        console.log(`${new_ff.userName} is now following ${new_ff.feedName}`);
    } catch (err: any) {
        console.error("Failed to insert feed:", err);
        throw err;
    }
    
} 
