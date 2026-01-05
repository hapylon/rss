import { fetchFeed } from "src/lib/rss";
import { getNextFeedToFetch } from "./getNextFeedToFetch";
import { markFeedFetched } from "./markfetchedfeed";

export async function scrapeFeeds(): Promise<void> {
    const nextFeed = await getNextFeedToFetch();
    await markFeedFetched(nextFeed.id);
    const fetched = await fetchFeed(nextFeed.url);
    if (!fetched) {
        throw new Error("problem fetching in scrapeFeeds()");
    }
    for (let i = 0; i < fetched.channel.item.length; i++) {
        console.log(fetched.channel.item[i].title);
    }
}