import { BeforeChatEvent, Location, Player, Vector } from "@minecraft/server";
import { PREFIX } from "../../config/commands";
import { LiteralArgumentType, LocationArgumentType } from "./ArgumentTypes";
import { CommandCallback } from "./Callback";
import type { Command } from "./Command";

/**
 * Returns a Before chat events augments
 * @example this.getChatAugments(BeforeChatEvent)
 */
export function getChatAugments(
  message: string,
  prefix: string
): Array<string> {
  return message
    .slice(prefix.length)
    .trim()
    .match(/"[^"]+"|[^\s]+/g)
    .map((e) => e.replace(/"(.+)"/, "$1").toString());
}

/**
 * Sends a command not found message to a player
 * @param player player to send message to
 */
export function commandNotFound(player: Player, command: string) {
  player.tell({
    rawtext: [
      {
        text: `§c`,
      },
      {
        translate: `commands.generic.unknown`,
        with: [`${command}`],
      },
    ],
  });
}

/**
 * Sends a command not found message to a player
 * @param player player to send message to
 */
export function noPerm(player: Player, command: Command) {
  player.tell({
    rawtext: [
      {
        text: command.data.invaildPermission
          ? command.data.invaildPermission
          : `§cYou do not have perrmission to use "${command.data.name}"`,
      },
    ],
  });
}

/**
 * Sends a syntax failure message to player
 * @param player
 * @param command
 * @param args
 * @param i
 */
export function commandSyntaxFail(
  player: Player,
  baseCommand: Command,
  command: Command,
  args: string[],
  i: number
) {
  player.tell({
    rawtext: [
      {
        text: `§c`,
      },
      {
        translate: `commands.generic.syntax`,
        with: [
          `${PREFIX}${baseCommand.data.name} ${args.slice(0, i).join(" ")}`,
          args[i] ?? " ",
          args.slice(i + 1).join(" "),
        ],
      },
    ],
  });
  if (command.children.length > 1 || !args[i]) {
    // this type could be many things
    const types = command.children.map((c) =>
      c.type instanceof LiteralArgumentType ? c.type.name : c.type?.typeName
    );
    player.tell(
      `§c"${args[i] ?? "undefined"}" is not vaild! Argument "${
        [...new Set(command.children.map((c) => c.type.name))][0]
      }" can be typeof: "${types.join('", "')}"`
    );
  } else {
    // this type is only 1 thing
    player.tell(`§c${command.children[0]?.type?.fail(args[i])}`);
  }
}

/**
 * Returns a location of the inputed aguments
 * @example parseLocationAugs(["~1", "3", "^7"], { location: [1,2,3] , viewVector: [1,2,3] })
 */
export function parseLocationAugs(
  [x, y, z]: [x: string, y: string, z: string],
  { location, viewVector }: { location: Location; viewVector: Vector }
): Location {
  if (!x || !y || !x) return null;
  const locations = [location.x, location.y, location.z];
  const viewVectors = [viewVector.x, viewVector.y, viewVector.z];
  const a = [x, y, z].map((arg) => {
    const r = parseInt(arg.replace(/\D/g, ""));
    return isNaN(r) ? 0 : r;
  });
  const b = [x, y, z].map((arg, index) => {
    return arg.includes("~")
      ? a[index] + locations[index]
      : arg.includes("^")
      ? a[index] + viewVectors[index]
      : a[index];
  });
  return new Location(b[0], b[1], b[2]);
}

/**
 * Sends a callback back to the command
 * @param cmdArgs the args that the command used
 * @param args args to use
 */
export function sendCallback(
  cmdArgs: string[],
  args: Command<any>[],
  event: BeforeChatEvent,
  baseCommand: Command<any>
) {
  const lastArg = args[args.length - 1] ?? baseCommand;
  const argsToReturn: any[] = [];
  for (const [i, arg] of args.entries()) {
    if (arg.type.name.endsWith("*")) continue;
    if (arg.type instanceof LocationArgumentType) {
      argsToReturn.push(
        parseLocationAugs(
          [cmdArgs[i], cmdArgs[i + 1], cmdArgs[i + 2]],
          event.sender
        )
      );
      continue;
    }
    if (arg.type instanceof LiteralArgumentType) continue;
    argsToReturn.push(arg.type.matches(cmdArgs[i]).value ?? cmdArgs[i]);
  }
  lastArg.callback(new CommandCallback(event), ...argsToReturn);
}
