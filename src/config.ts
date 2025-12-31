
import fs from "node:fs";
import { getUser, deleteUsers, getUsers } from "./lib/db/queries/users.js";

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
    const userName = args[0];
    const existingUser = await getUser(userName);
    if (!existingUser) {
        throw new Error(`User ${userName} not found`);
    }
    setUser(userName);
    console.log('User has been set')
}

export async function handlerDeleteUsers(cmdName: string, ...args: string[]): Promise<void> {
    await deleteUsers();
}

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

export async function handlerGetUsers(cmdName: string, ...args: string[]): Promise<void> {
    await getUsers();
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

function getConfigFilePath(): string {
    const homePath = os.homedir();
    return path.join(homePath, '.gatorconfig.json');
}

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

