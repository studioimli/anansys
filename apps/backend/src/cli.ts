/**
 * @file Command-Line Interface (CLI) for interacting with Anansys services.
 *
 * This CLI allows for direct interaction with the application's business logic.
 * It can be run with direct commands for scripting or in interactive mode.
 *
 * @example
 * ```bash
 * # Run in interactive mode
 * pnpm --filter backend cli
 *
 * # Run a command directly
 * pnpm --filter backend cli get-session 12345
 * ```
 */

import ora from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
import { getPlayerSessionById } from "./services/game-session.service";
import { getUserById, getAllUsers } from "./services/user.service";

/**
 * Defines the structure for a CLI command.
 */
interface Command {
  name: string;
  description: string;
  // If true, the command requires an argument (e.g., an ID)
  requiresArg: boolean;
  // The service function to execute
  action: (arg: string) => Promise<any>;
}

// A separate type for commands that don't need arguments
type NoArgCommand = Omit<Command, "action" | "requiresArg"> & {
  requiresArg: false;
  action: () => Promise<any>;
};

type AnyCommand = Command | NoArgCommand;

// Registry of all available CLI commands.
const commands: AnyCommand[] = [
  {
    name: "get-session",
    description: "Fetches a player game session by its unique ID.",
    requiresArg: true,
    action: getPlayerSessionById,
  },
  {
    name: "get-user",
    description: "Fetches a single user by their unique ID.",
    requiresArg: true,
    action: getUserById,
  },
  {
    name: "get-all-users",
    description: "Fetches a list of all users in the system.",
    requiresArg: false,
    action: getAllUsers,
  },
];

/**
 * Executes a specific command, handling spinners and results.
 * @param command The command to execute.
 * @param arg The argument for the command, if required.
 */
async function executeCommand(command: AnyCommand, arg?: string) {
  const spinner = ora({
    text: `Running command ${chalk.cyan(command.name)}...`,
    spinner: "dots",
  }).start();

  try {
    const result = command.requiresArg
      ? await (command as Command).action(arg!) // We validate arg exists before calling
      : await (command as NoArgCommand).action();

    if (result) {
      spinner.succeed(
        `Command ${chalk.green(command.name)} finished successfully.`,
      );
      console.log(JSON.stringify(result, null, 2));
    } else {
      spinner.warn(
        `Command ${chalk.yellow(
          command.name,
        )} completed, but returned no result.`,
      );
    }
  } catch (error) {
    spinner.fail(`Command ${chalk.red(command.name)} failed.`);
    if (error instanceof Error) {
      console.error(chalk.red(error.message));
    } else {
      console.error(chalk.red("An unknown error occurred."), error);
    }
    process.exit(1);
  }
}

/**
 * Starts the interactive CLI mode.
 */
async function startInteractiveMode() {
  console.log(chalk.bold.magenta("Welcome to the Anansys CLI!"));
  console.log("You can run services directly without using the API.\n");

  const { commandName } = await inquirer.prompt([
    {
      type: "list",
      name: "commandName",
      message: "Which command would you like to run?",
      choices: commands.map(cmd => ({
        name: `${chalk.cyan(cmd.name)} - ${cmd.description}`,
        value: cmd.name,
      })),
    },
  ]);

  const command = commands.find(cmd => cmd.name === commandName);
  if (!command) {
    // This should not happen with inquirer, but it's good practice
    console.error(chalk.red("Invalid command selected."));
    process.exit(1);
  }

  let arg: string | undefined;
  if (command.requiresArg) {
    const { argument } = await inquirer.prompt([
      {
        type: "input",
        name: "argument",
        message: `Please provide the argument for ${chalk.cyan(command.name)}:`,
        validate: (input: string) =>
          input ? true : "This value cannot be empty.",
      },
    ]);
    arg = argument;
  }

  await executeCommand(command, arg);
}

/**
 * Main function to parse arguments and run the CLI.
 */
async function main() {
  const args = process.argv.slice(2);
  const [commandName, arg] = args;

  if (!commandName) {
    // No command provided, so we start interactive mode
    await startInteractiveMode();
  } else {
    // Command provided, run non-interactively
    const command = commands.find(cmd => cmd.name === commandName);
    if (!command) {
      console.error(chalk.red(`Error: Command "${commandName}" not found.`));
      console.log(
        `Available commands: ${chalk.cyan(
          commands.map(cmd => cmd.name).join(", "),
        )}`,
      );
      process.exit(1);
    }

    if (command.requiresArg && !arg) {
      console.error(
        chalk.red(`Error: Missing argument for command "${command.name}".`),
      );
      process.exit(1);
    }

    await executeCommand(command, arg);
  }
}

main(); 