import { BeforeChatEvent } from "mojang-minecraft";
import { PREFIX } from "../../config/commands";

/**
 * Returns a Before chat events augments
 * @param {BeforeChatEvent} data chat data that was used
 * @returns {Array<string>} ["command", "?subCommand", "?args", "?args"]
 * @example getChatAugments(BeforeChatEvent)
 */
export function getChatAugments(data) {
  return data.message
    .slice(PREFIX.length)
    .trim()
    .match(/"[^"]+"|[^\s]+/g)
    .map((e) => e.replace(/"(.+)"/, "$1").toString());
}

/**
 * Returns a replay to the player if a command wasent found
 * @param {BeforeChatEvent} data chat data that was used
 * @example commandNotFound(BeforeChatEvent)
 */
export function commandNotFound(data) {
  data.sender.tell({
    translate: `commands.generic.unknown`,
    with: [`§f${getChatAugments(data)[0]}§c`],
  });
}
