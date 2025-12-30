import { setUser, readConfig, CommandsRegistry, handlerLogin, registerCommand, runCommand } from "./config.js";


function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  
  const args = process.argv.slice(2); // Remove node and script path
  if (args.length < 1) {
    console.log("not enough args");
    process.exit(1);
  }
  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  
  try {
  runCommand(registry, cmdName, ...cmdArgs);
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
  } else {
    console.error(error);
  }
}
  console.log(readConfig());
}

main();