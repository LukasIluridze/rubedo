import { ROLES } from "../../../../types";
import { ArgumentTypes, Command } from "../../../../lib/Command/Command";
import {
  getRole,
  getServerOwner,
  isServerOwner,
  setRole,
  setServerOwner,
} from "../../utils.js";
import { TABLES } from "../../../../lib/Database/tables";

// Helper
const StringIsNumber = (value: any) => isNaN(Number(value)) === false;

// Turn enum into array
function ToArray(enumme: any) {
  return (
    Object.keys(enumme)
      // @ts-ignore
      .filter(StringIsNumber)
      .map((key) => enumme[key])
  );
}

const root = new Command({
  name: "role",
  description: "Changes the role for a player",
  requires: (player) => getRole(player) == "admin" || isServerOwner(player),
});

root
  .literal({
    name: "set",
    description: "Sets the role for a player",
  })
  .argument(new ArgumentTypes.playerName("playerName"))
  .argument(new ArgumentTypes.array("role", ToArray(ROLES) as string[]))
  .executes((ctx, playerName, role) => {
    setRole(playerName, role as keyof typeof ROLES);
    ctx.reply(`Changed role of ${playerName} to ${role}`);
  });

root
  .literal({
    name: "get",
    description: "Gets the role of a player",
  })
  .argument(new ArgumentTypes.playerName("playerName"))
  .executes((ctx, playerName) => {
    ctx.reply(`${playerName} has role: ${getRole(playerName)}`);
  });

const ownerRoot = root.literal({
  name: "owner",
  description: "Manages the owner",
});

ownerRoot
  .literal({
    name: "get",
    description: "Gets the owner of the world",
  })
  .executes((ctx) => {
    const ownerId = getServerOwner();
    const ids = TABLES.ids.getCollection();
    const ownerName = Object.keys(ids).find((key) => ids[key] === ownerId);
    ctx.reply(`§aServer Owner: ${ownerName} (id: ${ownerId})`);
  });

ownerRoot
  .literal({
    name: "transfer",
    description: "Transfers the owner of the world",
    requires: (player) => isServerOwner(player),
  })
  .argument(new ArgumentTypes.player())
  .executes((ctx, player) => {
    setServerOwner(player);
    ctx.reply(`§aSet the server Owner to: ${player.name} (id: ${player.id})`);
  });
