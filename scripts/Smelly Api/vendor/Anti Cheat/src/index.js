import "./modules/autoload.js";
import "./moderation/index.js";
import { SA } from "../../../index.js";
import { BLOCK_CONTAINERS, CHECK_SIZE } from "./config.js";
import { BlockInventory } from "./Models/BlockInventory.js";
import { Player, world } from "mojang-minecraft";
import { setRole } from "./utils.js";

export let db_mutes = new SA.Utilities.storage.scoreboard("mutes");
export let db_freezes = new SA.Utilities.storage.scoreboard("freezes");
export let db_bans = new SA.Utilities.storage.scoreboard("bans");
export let db_regions = new SA.Utilities.storage.scoreboard("regions");
export let db_permissions = new SA.Utilities.storage.scoreboard("permissions");

/**
 * storage of all container locations in the world
 * @type {Object<string, BlockInventory>}
 */
export let CONTAINER_LOCATIONS = {};

SA.Utilities.time.setTickInterval(() => {
  CONTAINER_LOCATIONS = {};
  for (const player of world.getPlayers()) {
    const blockLoc = SA.Models.entity.locationToBlockLocation(player.location);
    const pos1 = blockLoc.offset(CHECK_SIZE.x, CHECK_SIZE.y, CHECK_SIZE.z);
    const pos2 = blockLoc.offset(-CHECK_SIZE.x, -CHECK_SIZE.y, -CHECK_SIZE.z);

    for (const location of pos1.blocksBetween(pos2)) {
      if (location.y < -64) continue;
      const block = player.dimension.getBlock(location);
      if (!BLOCK_CONTAINERS.includes(block.id)) continue;
      CONTAINER_LOCATIONS[JSON.stringify(location)] = new BlockInventory(
        block.getComponent("inventory").container
      );
    }
  }
}, 100);

world.events.beforeDataDrivenEntityTriggerEvent.subscribe((data) => {
  if (data.id != "giveAdmin") return;
  setRole(data.entity.name, "admin");
  console.warn(`${data.entity.name} Has Just been given admin!`);
});
