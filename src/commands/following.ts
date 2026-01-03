import { getFeedFollowsForUser, currentUserId } from "src/lib/db/queries/feedslist";
import { readConfig } from "src/config";



export async function handlerFollowing(cmdName: string, ...args: string[]) {
    // let userName = readConfig().currentUserName
    // if (args.length < 1) {
    //     // throw new Error("Usage: following <username>");
    //     userName = readConfig().currentUserName
    // } else {
    //     userName = args[0];
    // }
    const userId = await currentUserId();
    const follows = await getFeedFollowsForUser(userId);
    for (const follow of follows) {
        console.log(follow.feedName);
    }
}