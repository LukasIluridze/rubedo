import { world } from "@minecraft/server";
import { PREFIX } from "../../config/commands";
import type { Command } from "./Command";
import {
  commandNotFound,
  commandSyntaxFail,
  getChatAugments,
  noPerm,
  sendCallback,
} from "./utils";

/**
 * An array of all active commands
 */
export const COMMANDS: Command<any>[] = [];

world.events.beforeChat.subscribe((data) => {
  if (!data.message.startsWith(PREFIX)) return; // This is not a command
  data.cancel = true;
  const args = getChatAugments(data.message, PREFIX);
  const command = COMMANDS.find(
    (c) =>
      c.depth == 0 &&
      (c.data.name == args[0] || c.data?.aliases?.includes(args[0]))
  );
  if (!command) return commandNotFound(data.sender, args[0]);
  if (!command.data?.requires(data.sender)) return noPerm(data.sender, command);
  args.shift(); // Remove first command so we can look at args
  // Check Args/SubCommands for errors
  const verifiedCommands: Command[] = [];
  const getArg = (start: Command<any>, i: number): string => {
    if (start.children.length > 0) {
      const arg = start.children.find((v) => v.type.matches(args[i]).success);
      if (!arg && !args[i] && start.callback) return;
      if (!arg)
        return commandSyntaxFail(data.sender, command, start, args, i), "fail";
      if (!arg.data?.requires(data.sender))
        return noPerm(data.sender, arg), "fail";
      verifiedCommands.push(arg);
      return getArg(arg, i + 1);
    }
  };
  if (getArg(command, 0)) return;
  sendCallback(args, verifiedCommands, data, command);
});
