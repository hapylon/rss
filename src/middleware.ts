import { CommandHandler, UserCommandHandler } from "./commands/commands";
import { getUser } from "./lib/db/queries/users";
import { readConfig } from "./config";

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]): Promise<void> => {
        const config = readConfig()
        const userName = config.currentUserName;
        if (!userName) {
        throw new Error(`User not logged in`);
        }

        const user = await getUser(userName);
        if (!user) {
        throw new Error(`User ${userName} not found`);
        }

        await handler(cmdName, user, ...args);
    };
}