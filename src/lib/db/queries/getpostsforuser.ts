import {feeds, feed_follows, users, posts } from "../schema";
import { db } from "..";
import { eq, asc, desc } from "drizzle-orm";

export async function getPostsForUser(user_id: string, num_posts: number = 2) {
    
    const user_posts_query = await db
        .select({
            id: posts.id,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
            title: posts.title,
            url: posts.url,
            description: posts.description,
            publishedAt: posts.publishedAt,
            // feed_id: posts.feed_id,

            userId: feed_follows.user_id,
            feedId: feed_follows.feed_id,
            feedName: feeds.name,
        })
        .from(posts)
        .innerJoin(feed_follows, eq(posts.feed_id, feed_follows.feed_id))
        .innerJoin(feeds, eq(posts.feed_id, feeds.id))
        .where(eq(feed_follows.user_id, user_id))
        .orderBy(desc(posts.publishedAt))
        .limit(num_posts);

    return user_posts_query;
}

// export async function getPostsForUser(user_id: string, num_posts: number = 2) {
    
//     const feedFollowSubQuery = db
//         .select({
//             user_id: feed_follows.user_id,
//             feed_id: feed_follows.feed_id
//         })
//         .from(feed_follows)
//         .as('feeds_followed');
    
//     const feedSubQuery = db
//         .select({
//             feed: feeds.name,
//             id: feeds.id
//         })
//         .from(feeds)
//         .as('feed_names');
    
//     const user_posts_query = await db
//         .select({
//             id: posts.id,
//             createdAt: posts.createdAt,
//             updatedAt: posts.updatedAt,
//             title: posts.title,
//             url: posts.url,
//             description: posts.description,
//             publishedAt: posts.publishedAt,
//             feed_id: posts.feed_id,

//             userId: feed_follows.user_id,
//             feedId: feed_follows.feed_id,
//             feedName: feedSubQuery.feed,
//         })
//         .from(posts)
//         .leftJoin(feedFollowSubQuery, eq(posts.feed_id, feed_follows.feed_id))
//         .leftJoin(feedSubQuery, eq(posts.feed_id, feedSubQuery.id))
//         .where(eq(feed_follows.user_id, user_id))
//         .orderBy(desc(posts.publishedAt))
//         .limit(num_posts);

//     return user_posts_query;
// }