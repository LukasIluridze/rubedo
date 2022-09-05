import { SA } from "../../../../../index.js";
import { db_bans } from "../../index.js";
import { getRole } from "../../utils.js";

new SA.Command({
  name: "unban",
  description: "Unban a banned player",
  hasPermission: (player) => getRole(player.name) == "admin",
})
  .addOption("player", "string", "Player to ban")
  .executes((ctx, { player }) => {
    const banData = db_bans.values().find((ban) => ban.player == player);
    if (!banData) return ctx.reply(`${player} is not banned`);
    db_bans.delete(banData.key);
    ctx.reply(`§a${player}§r has been Unbanned!`);
  });
