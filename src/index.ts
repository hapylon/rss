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
import { handlerResetUsers } from "./commands/resetUsers"
import { handlerAgg } from "./commands/aggregate"
import { handlerAddFeed } from "./commands/addfeed"
import { handlerArbitrary} from "./commands/arbitrary"
import { handlerFeeds } from "./lib/db/queries/feedslist"
import { handlerFollowing } from "./commands/following"
import { handlerFollow, handlerUnFollow } from "./commands/follow"
import { middlewareLoggedIn } from "./middleware"
import { handlerBrowse } from "./commands/browse"

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
  registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry, "arbitrary", handlerArbitrary); 
  registerCommand(registry, "feeds", handlerFeeds);
  registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));
  registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnFollow));
  registerCommand(registry, "browse", middlewareLoggedIn(handlerBrowse));
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