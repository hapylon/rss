import { setUser, 
  readConfig, 
  CommandsRegistry, 
  handlerLogin, 
  handlerRegisterUser,
  registerCommand, 
  runCommand 
} from "./config.js";


async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegisterUser);

  const args = process.argv.slice(2); // Remove node and script path
  if (args.length < 1) {
    console.log("not enough args");
    process.exit(1);
  }
  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  
  try {
  await runCommand(registry, cmdName, ...cmdArgs);
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
  } else {
    console.error(error);
  }
}
  console.log(readConfig());
  process.exit(0);
}

main();