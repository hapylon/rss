import { RSSFeed } from "src/lib/rss";
import { db } from "..";
import { feeds } from "../schema";
import { sql } from "drizzle-orm";
import type { Feed } from "src/lib/rss";

export async function getNextFeedToFetch(): Promise<Feed> {
    const nextFeeds = await db
    .select()
    .from(feeds)
    .orderBy(
        sql`${feeds.lastFetchedAt} ASC NULLS FIRST`
    )
    .limit(1);
    if (!nextFeeds[0]) {
        throw new Error("gNFTF() found no feeds to fetch!")
    }
    const next = nextFeeds[0]
    return next;
}