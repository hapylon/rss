// import type { RSSFeed } from "./rss";

// export function printFeed(feed: RSSFeed) {
    
// }

const rows = await db.select().from(users);
console.log(rows);