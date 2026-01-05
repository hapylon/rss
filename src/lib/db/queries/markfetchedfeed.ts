import { db } from "..";
import { feeds } from "../schema";
import { eq } from "drizzle-orm";

export async function markFeedFetched(feedId: string): Promise<void> {
    await db
    .update(feeds)
    .set({
        // updatedAt: new Date(),
        lastFetchedAt: new Date(),
    })
    .where(eq(feeds.id, feedId));
}