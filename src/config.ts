// import fs from "fs";
import fs from "node:fs";
import { getConfigFilePath } from "./paths.js";

import os from "os";
import path from "path";
// import { registerUser } from "./lib/db/queries/users.js";

export type Config = {
    dbUrl: string,
    currentUserName: string
}

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        console.log("Usage: login <userName> (userName is a required argument)");
        process.exit(1);
    }
    setUser(args[0]);
    console.log('User has been set')
}

// export async function handlerRegisterUser(cmdName: string, ...args: string[]): Promise<void> {
//     console.log("handlerRegisterUser called with:", cmdName, args);
//     if (args.length < 1) {
//         console.log("Usage: return <name> (name is a required argument)");
//         process.exit(1);
//     }
    
//     const name_ = args[0];
//     await registerUser(name_);
// }

export async function handlerRegisterUser(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length < 1) {
    console.log("Usage: register <name> (name is a required argument)");
    process.exit(1);
  }

  const name = args[0];
  const { registerUser } = await import ("./lib/db/queries/users.js");
  await registerUser(name);
}

export type CommandsRegistry = Record<string, CommandHandler>;

export const cmd_reg: CommandsRegistry = {};

export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    const handler = registry[cmdName];
    if (handler) {
        await handler(cmdName, ...args);
    }
}



// export function setUser(username: string): void {
    
//     console.log("setUser called with:", username);

//     const before = readConfig();
//     console.log("config before:", before);
    
//     const existing_config = readConfig();
//     existing_config.currentUserName = username;
//     writeConfig(existing_config);

//     const after = readConfig();
//     console.log("config after:", after);
// }

// export function readConfig(): Config {
//     const filePath = getConfigFilePath();
//     const jsonString = fs.readFileSync(filePath, 'utf-8');
//     const rawconfig: any = JSON.parse(jsonString);
//     return validateConfig(rawconfig);
// }

// function writeConfig(cfg: Config): void {
//     const filepath = getConfigFilePath();
//     const dataToWrite = {
//         db_url: cfg.dbUrl,
//         current_user_name: cfg.currentUserName
//     };
//     try {
//         const jsonString = JSON.stringify(dataToWrite, null, 2);
//         fs.writeFileSync(filepath, jsonString, 'utf-8');
//         console.log(`Successfully wrote data to ${filepath}`);
//     } catch (error) {
//         console.error('Error writing JSON file', error);
//     }
// }

function getConfigFilePath(): string {
    const homePath = os.homedir();
    return path.join(homePath, '.gatorconfig.json');
}

// function validateConfig(rawconfig: any): Config {
//   if (typeof rawconfig !== "object" || rawconfig === null) {
//     throw new Error("Parsed result is not a valid object");
//   }

//   if (typeof rawconfig.db_url !== "string") {
//     throw new Error("rawconfig structure or types invalid");
//   }

//   return {
//     dbUrl: rawconfig.db_url,
//     currentUserName:
//       typeof rawconfig.current_user_name === "string"
//         ? rawconfig.current_user_name
//         : "",
//   };
// }

function validateConfig(raw: any): Config {
  return {
    dbUrl: raw.db_url,
    currentUserName: raw.current_user_name,
  };
}

export function readConfig(): Config {
  const filePath = getConfigFilePath();
  const jsonString = fs.readFileSync(filePath, "utf-8");
  const rawconfig: any = JSON.parse(jsonString);
  return validateConfig(rawconfig);
}

function writeConfig(cfg: Config): void {
  const filepath = getConfigFilePath();
  const dataToWrite = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  const jsonString = JSON.stringify(dataToWrite, null, 2);
  fs.writeFileSync(filepath, jsonString, "utf-8");
}

export function setUser(username: string): void {
  const cfg = readConfig();
  cfg.currentUserName = username;
  writeConfig(cfg);
}

