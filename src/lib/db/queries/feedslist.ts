import { db } from "src/lib/db";
import { users, feeds, feed_follows } from "src/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { FeedFollows } from "../../rss"
import { readConfig } from "src/config";



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

export async function createFeedFollow(userId: string, feedId: string) {
    const new_ff_row = {user_id: userId, feed_id: feedId} as FeedFollows;
    
    const inserted_row =await db.insert(feed_follows).values(new_ff_row);
    
    const userSubQuery = db
    .select({
        user: users.name,
        id: users.id
    })
    .from(users)
    .as('user_names');

    const feedSubQuery = db
    .select({
        feed: feeds.name,
        id: feeds.id
    })
    .from(feeds)
    .as('feed_names');
    
    const [ff_query] = await db
    .select({
        id: feed_follows.id,
        createdAt: feed_follows.createdAt,
        updatedAt: feed_follows.updatedAt,
        userId: feed_follows.user_id,
        feedId: feed_follows.feed_id,
        userName: userSubQuery.user,
        feedName: feedSubQuery.feed,
    })
    .from(feed_follows)
    .leftJoin(userSubQuery, eq(feed_follows.user_id, userSubQuery.id))
    .leftJoin(feedSubQuery, eq(feed_follows.feed_id, feedSubQuery.id))
    .where(and(
    eq(feed_follows.user_id, new_ff_row.user_id), 
    eq(feed_follows.feed_id, new_ff_row.feed_id)
    ));

    return ff_query;
}

export async function urlToName(url: string) {
    const [urlName] = await db
    .select({ value: feeds.name })
    .from(feeds)
    .where(eq(feeds.url, url));
    return urlName.value;
}

export async function urlToFeedId(url: string) {
    const [feedId] = await db
    .select({ value: feeds.id })
    .from(feeds)
    .where(eq(feeds.url, url));
    return feedId.value;
}

export async function currentUserId() {
    const current_name = readConfig().currentUserName;
    const [current_id] = await db
    .select({ value: users.id })
    .from(users)
    .where(eq(users.name, current_name));
    return current_id.value;
}

export async function getFeedFollowsForUser(user_id: string) {
    const userSubQuery = db
        .select({
            user: users.name,
            id: users.id
        })
        .from(users)
        .as('user_names');

    const feedSubQuery = db
        .select({
            feed: feeds.name,
            id: feeds.id
        })
        .from(feeds)
        .as('feed_names');
    
    const user_feeds_query = await db
        .select({
            id: feed_follows.id,
            createdAt: feed_follows.createdAt,
            updatedAt: feed_follows.updatedAt,
            userId: feed_follows.user_id,
            feedId: feed_follows.feed_id,
            userName: userSubQuery.user,
            feedName: feedSubQuery.feed,
        })
        .from(feed_follows)
        .leftJoin(userSubQuery, eq(feed_follows.user_id, userSubQuery.id))
        .leftJoin(feedSubQuery, eq(feed_follows.feed_id, feedSubQuery.id))
        .where(eq(feed_follows.user_id, user_id));

    return user_feeds_query;
}