import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string,
    currentUserName: string
}

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export function handlerLogin(cmdName: string, ...args: string[]): void {
    if (args.length < 1) {
        console.log("Usage: login <userName> (userName is a required argument)");
        process.exit(1);
    }
    setUser(args[0]);
    console.log('User has been set')
}

export type CommandsRegistry = Record<string, CommandHandler>;

export const cmd_reg: CommandsRegistry = {};

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    const handler = registry[cmdName];
    if (handler) {
        handler(cmdName, ...args);
    }
}



export function setUser(username: string): void {
    const existing_config = readConfig();
    existing_config.currentUserName = username;
    writeConfig(existing_config);
}

export function readConfig(): Config {
    const filePath = getConfigFilePath();
    const jsonString = fs.readFileSync(filePath, 'utf-8');
    const rawconfig: any = JSON.parse(jsonString);
    return validateConfig(rawconfig)
}

function writeConfig(cfg: Config): void {
    const filepath = getConfigFilePath();
    const dataToWrite = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    }
    try {
        const jsonString = JSON.stringify(dataToWrite, null, 2);
        fs.writeFileSync(filepath, jsonString, 'utf-8');
        console.log(`Successfully wrote data to ${filepath}`);
    } catch (error) {
        console.error('Error writing JSON file', error);
    }
}

function getConfigFilePath(): string {
    const homePath = os.homedir();
    return path.join(homePath, '.gatorconfig.json');
}

function validateConfig(rawconfig: any): Config {
  if (typeof rawconfig !== "object" || rawconfig === null) {
    throw new Error("Parsed result is not a valid object");
  }

  if (typeof rawconfig.db_url !== "string") {
    throw new Error("rawconfig structure or types invalid");
  }

  return {
    dbUrl: rawconfig.db_url,
    currentUserName:
      typeof rawconfig.current_user_name === "string"
        ? rawconfig.current_user_name
        : "",
  };
}

