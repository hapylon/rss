
import fs from "node:fs";
import os from "os";
import path from "path";
import { db } from "./lib/db";
import { users } from "./lib/db/schema";
import { eq } from "drizzle-orm";
import type { User } from "./lib/rss";

export type Config = {
    dbUrl: string,
    currentUserName: string
}

export function setUser(username: string): void {
  const cfg = readConfig();
  cfg.currentUserName = username;
  writeConfig(cfg);
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required in config file");
  }
  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("current_user_name is required in config file");
  }

  const config: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };

  return config;
}

export function readConfig(): Config {
  const filePath = getConfigFilePath();
  const jsonString = fs.readFileSync(filePath, "utf-8");
  const rawconfig: any = JSON.parse(jsonString);
  return validateConfig(rawconfig);
}

function getConfigFilePath(): string {
    const homePath = os.homedir();
    return path.join(homePath, '.gatorconfig.json');
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

// export async function getUser(userName: string): Promise<User> {
//   const [returnUser] = await db
//     .select({
//       id: users.id, 
//       createdAt: users.createdAt,
//       updatedAt: users.updatedAt,
//       name: users.name
//     })
//     .from(users)
//     .where(eq(users.name, userName)
//   );
//   return returnUser;
// }