import { XMLParser } from "fast-xml-parser";
import { users, feeds } from "./db/schema";
import { db } from "./db"
import { eq } from "drizzle-orm";
import { UUID } from "node:crypto";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export type Feed = typeof feeds.$inferSelect;
export type User = typeof users.$inferSelect;

export async function agg(url: string = "https://www.wagslane.dev/index.xml", ...args: string[]): Promise<void> {
    let result = await fetchFeed(url);
    console.log(result);
}

export async function createFeed(
    feed_name: string, 
    feed_url: string, 
    // current_name: string,
    user_uuid: string,
) {
    return {name: feed_name, url: feed_url, user_id: user_uuid} as Feed;
}

export async function addfeed(feed: Feed) {
    await db.insert(feeds).values(feed);
    // const result = await db.insert(feeds).values(feed);
    // return result;
}

export async function printFeed(feed: Feed, user: User) {
  console.log("Feed:");
  console.log(`  id:       ${feed.id}`);
  console.log(`  name:     ${feed.name}`);
  console.log(`  url:      ${feed.url}`);
  console.log(`  user_id:  ${feed.user_id}`);
  console.log("User:");
  console.log(`  id:       ${user.id}`);
  console.log(`  name:     ${user.name}`);
}

export async function fetchFeed(feedURL: string) {
    // const fetchRSSFeed = async (url) => {
    
    try {
        const customUserAgent = 'gator';
        const response = await fetch(feedURL, {headers: { 'User-Agent': customUserAgent}});
        if (!response.ok) {
            throw new Error(`HTTP error, status: ${response.status}`);
        }
        const xmlText = await response.text();
        const options = {
            ignoreAttributes: false,
            attributeNamePrefix: "@_",
        };
        const parser = new XMLParser(options);
        const jsonObj = parser.parse(xmlText);
        if (!jsonObj.rss.channel) {
            console.log("jsonObject has no channel field")
            throw new Error("jsonObject has no channel field");
        }
        const f_channel: string = jsonObj.rss.channel
        const f_title: string = jsonObj.rss.channel?.title;
        const f_link: string = jsonObj.rss.channel?.link;
        const f_description: string = jsonObj.rss.channel?.description;
        let items: RSSItem[] = []; 
        if (!jsonObj.rss.channel.item ) {
            const item = [];
        } else {
            for (let i=0; i < jsonObj.rss.channel.item.length; i++) {
                let item_title = jsonObj.rss.channel.item[i]?.title;
                let item_link = jsonObj.rss.channel.item[i]?.link;
                let item_description = jsonObj.rss.channel.item[i]?.description;
                let item_pubDate = jsonObj.rss.channel.item[i]?.pubDate

                if (!item_title
                    || !item_link
                    || !item_description
                    || !item_pubDate) {
                        continue;
                    } else {
                        items[i] = {
                            "title": item_title,
                            "link": item_link,
                            "description": item_description,
                            "pubDate": item_pubDate
                    };
                }
            }
        }
        const assembled = {
            channel: {
                title: f_title,
                link: f_link,
                description: f_description,
                item: items
            }
        }
        return assembled;
    } catch (error) {
        console.error("Error fetching or parsing RSS feed:", error);
    }
}
