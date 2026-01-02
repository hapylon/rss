import { 
  CommandsRegistry, 
  registerCommand, 
  runCommand,
} from "./commands/commands"
import {
  handlerLogin,
  handlerRegisterUser,
  handlerGetUsers, 
} from "./commands/users"
import { handlerResetUsers } from "./commands/resetUsers";
import { handlerAgg } from "./commands/agg"
import { handlerAddFeed } from "./commands/addfeed"
import { handlerArbitrary} from "./commands/arbitrary"
import { handlerFeeds } from "./commands/feedslist";

async function main() {
  const args = process.argv.slice(2); // Remove node and script path
  
  if (args.length < 1) {
    console.log("not enough args");
    process.exit(1);
  }
  
  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const registry: CommandsRegistry = {};
  
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegisterUser);
  registerCommand(registry, "reset", handlerResetUsers);
  registerCommand(registry, "users", handlerGetUsers);
  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry, "addfeed", handlerAddFeed);
  registerCommand(registry, "arbitrary", handlerArbitrary); 
  registerCommand(registry, "feeds", handlerFeeds);
try {
  await runCommand(registry, cmdName, ...cmdArgs);
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
  } else {
    console.error(error);
  }
  process.exit(1);
}
  process.exit(0);
}

main();