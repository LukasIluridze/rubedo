import { Command } from "../../../../lib/Command/Command.js";
import { getRole } from "../../utils.js";
import { showHome } from "../forms/home.js";

new Command({
  name: "settings",
  description: "Opens up the settings menu for the player",
  requires: (player) => ["admin", "moderator"].includes(getRole(player)),
}).executes((ctx) => {
  showHome(ctx.sender);
  ctx.sender.tell(`§aForm request sent, close chat to continue!`);
});
