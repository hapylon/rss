import { getPostsForUser } from "src/lib/db/queries/getpostsforuser";
import { User } from "src/lib/rss";

export async function browse(user_id: string, num_posts: number = 2) {
    // const user = await currentUserId();
    const recent_posts = await getPostsForUser(user_id, num_posts);
    for (const post of recent_posts) {
        console.log(`${post.feedName} - ${post.title}`);
        console.log(post.url);
        console.log(post.publishedAt);
        console.log("");
    }

}

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
    let limit = 2;
    if (args.length >= 1) {
        const parsed = Number(args[0]);
    if (!Number.isNaN(parsed) && parsed > 0) {
      limit = parsed;
    }
  }
    await browse(user.id, limit);
}