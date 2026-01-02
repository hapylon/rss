import { db } from "src/lib/db";
import { users, feeds } from "src/lib/db/schema";
import { eq } from "drizzle-orm";

export async function handlerFeeds(cmdName: string, ...args: string[]): Promise<void> {
    const userNameSubquery = await db
        .select({
            user: users.name,
            id: users.id
        })
        .from(users)
        .as('user_names');

    const feedsQuery = await db.select({
        feed: feeds.name,
        url: feeds.url,
        name: userNameSubquery.user
        })
        .from(feeds)
        .leftJoin(userNameSubquery, eq(feeds.user_id, userNameSubquery.id));
    console.log(feedsQuery);
}