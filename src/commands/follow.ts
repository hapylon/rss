import { readConfig } from "src/config";
import { db } from "src/lib/db";
import { users, feeds, feed_follows } from "src/lib/db/schema";
import { eq } from "drizzle-orm";
import { FeedFollows, addfeed, createFeed, printFeed } from "src/lib/rss";
import { urlToName, currentUserId, createFeedFollow, urlToFeedId } from "src/lib/db/queries/feedslist";

// export async function handlerFollow(cmdName: string, ...args: string[]) {
//     if (args.length < 2) {
//         throw new Error("Usage: addfeed <feed name> <feed url>");
//     }
//     const feedName = args[0];
//     const feedURL = args[1];
//     const cfg = readConfig();
//     const current_name = cfg.currentUserName;
//     const [feeds_row] = await db
//     .select()
//     .from()
// }

export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error("Usage: following <username>");
    }
    const url = args[0];
    const userId = await currentUserId();
    const current_user_name = readConfig().currentUserName
    const feedName = await urlToName(url);
    const feedId = await urlToFeedId(url);
    
    const feedfollow = await createFeedFollow(userId, feedId);
    
    console.log(`${current_user_name} is now following ${feedName}!`);
    
    // return feedfollow;
    // return {user_id: userId, feed_id: feedId} as feed_follows;
}