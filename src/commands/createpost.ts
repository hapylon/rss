import { db } from "src/lib/db";
import { users, feeds, posts } from "src/lib/db/schema";
import { parseRSSDate } from "src/lib/db/utils/parserssdate";
// import { urlToName } from "src/lib/db/queries/feedslist";
import { eq, and } from "drizzle-orm";

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export async function createPost(
    post_title: string, 
    post_url: string,
    post_description: string, 
    post_publishedAt: string, 
    post_feed_id: typeof feeds.$inferSelect.id): Promise<void> {
    
        const date = parseRSSDate(post_publishedAt, post_feed_id);
        // const feedName = await urlToName(post_feed_id);
        const new_post: NewPost = {
            title: post_title,
            url: post_url,
            description: post_description,
            publishedAt: date,
            feed_id: post_feed_id
        };
        
        const [existingPost] = await db
        .select()
        .from(posts)
        .where(eq(posts.url, post_url));
        
        if (!existingPost) {
            await db.insert(posts).values(new_post);
        } else {
            const existingTime = existingPost.publishedAt?.getTime() ?? null;
            const newTime = date?.getTime() ?? null;
            
            if (existingTime !== newTime) {
                try {
                    await db
                    .update(posts)
                    .set({
                        title: post_title,
                        description: post_description,
                        publishedAt: date
                    })
                    .where(eq(posts.url, post_url));
                } catch (error) {
                    console.error('Error updating title, description, publishedAt', error);
                }
            }
        }
}