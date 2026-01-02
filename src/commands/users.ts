import { registerUser, getUsers, getUser } from "../lib/db/queries/users";

import { setUser, readConfig } from "../config";

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new Error("Usage: login <userName> (userName is a required argument)");
    }
    const userName = args[0];
    const existingUser = await getUser(userName);
    if (!existingUser) {
        throw new Error(`User ${userName} not found`);
    }
    setUser(existingUser.name);
    console.log('User has been set')
}

export async function handlerRegisterUser(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length < 1) {
    throw new Error("Usage: register <name> (name is a required argument)");
  }
  const userName = args[0];
  const user = await registerUser(userName); 
  if (!user) {
    throw new Error(`User ${userName} not found!`);
  }
  setUser(user.name);
  console.log("User created!");
}

export async function handlerGetUsers(cmdName: string, ...args: string[]) {
    const users = await getUsers();
    const config = readConfig();

    for (const user of users) {
      if (user.name === config.currentUserName) {
        console.log(`* ${user.name} (current)`);
        continue;
      }
      console.log(`* $user.name)`);
    }
}
