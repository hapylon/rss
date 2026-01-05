import { getFeedFollowsForUser, currentUserId } from "src/lib/db/queries/feedslist";
import { readConfig } from "src/config";
import { User } from "src/lib/rss";



export async function handlerFollowing(cmdName: string, user:User, ...args: string[]) {
    // let userName = readConfig().currentUserName
    // if (args.length < 1) {
    //     // throw new Error("Usage: following <username>");
    //     userName = readConfig().currentUserName
    // } else {
    //     userName = args[0];
    // }
    // const userId = await currentUserId();
    const follows = await getFeedFollowsForUser(user.id);
    if (follows.length === 0) {
        console.log(`No feed follows found for this user.`);
        return;
    }

    for (let follow of follows) {
        console.log(follow.feedName);
    }
}