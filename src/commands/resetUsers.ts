import { resetUsers } from "../lib/db/queries/users";

export async function handlerResetUsers(cmdName: string, ...args: string[]): Promise<void> {
    await resetUsers();
    console.log("Database reset successfully!");
}