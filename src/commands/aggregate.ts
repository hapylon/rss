// import { agg  } from "..lib/db/queries/agg";
import { fetchFeed } from "../lib/rss.js";
import { scrapeFeeds } from "src/lib/db/queries/scrapeFeeds.js";
import { durationToMs } from "../lib/time.js"


export async function handlerFetchFeed(cmdName:string, ...args:string[]): Promise<void> {
    const fetched = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log("feed fetched:");
    console.log(fetched);
}

export async function handlerAgg(cmdName:string, ...args:string[]): Promise<void> {
    const timeString = args[0];
    await agg(timeString);
}

function handleError(err: unknown) {
    console.error("A problem occurred when trying to scrape feeds via agg()", err);
}

export async function agg(time_between_reqs: string): Promise<void> {
    const timeInMs = durationToMs(time_between_reqs);
    const timeInS = timeInMs/1000;
    console.log(`Collecting feeds every ${timeInS} seconds`);
    
    await scrapeFeeds();
    
    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeInMs);
    
    await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
        console.log("Shutting down feed aggregator...");
        clearInterval(interval);
        resolve();
    });
    });
}

    // const fetched = await fetchFeed("https://www.wagslane.dev/index.xml");
    // const whole = JSON.stringify(fetched);
    // // console.log("feed fetched:");
    // console.log(whole);