// import { agg  } from "..lib/db/queries/agg";
import { agg, fetchFeed } from "../lib/rss.js";

export async function handlerFetchFeed(cmdName:string, ...args:string[]): Promise<void> {
    const fetched = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log("feed fetched:");
    console.log(fetched);
}

export async function handlerAgg(cmdName:string, ...args:string[]): Promise<void> {
    const fetched = await fetchFeed("https://www.wagslane.dev/index.xml");
    const whole = JSON.stringify(fetched);
    // console.log("feed fetched:");
    console.log(whole);
}