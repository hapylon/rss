import { urlToName } from "../queries/feedslist";

export function parseRSSDate(rss_date: string, feed_id: string): Date | null {
    const date = new Date(rss_date);
    const feedName = urlToName(feed_id);
    if (isNaN(date.getTime())) {
        console.error("Invalid RSS date", { rss_date, feedName });
        return null;
    }
    return date;

}