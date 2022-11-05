import { world } from "@minecraft/server";
import { TABLES } from "../../lib/Database/tables";
import { DIMENSIONS, setRole } from "../../utils";
import { Mute } from "../models/Mute";
import { ChangePlayerRoleTask } from "../models/Task";

world.events.playerJoin.subscribe(({ player }) => {
  let e = world.events.tick.subscribe((data) => {
    try {
      DIMENSIONS.overworld.runCommand(`testfor @a[name="${player.name}"]`);
      world.events.tick.unsubscribe(e);
      if (Mute.getMuteData(player)) player.runCommand(`ability @s mute true`);
      if (!player.hasTag("old")) {
        // Player is new!
        TABLES.ids.set(player.name, player.id);
      } else {
        player.addTag("old");
      }
      /**
       * This is a role that was tried to push when the player was offline
       * so were setting it now because the player just joined
       */
      const roleToSet = ChangePlayerRoleTask.getPlayersRoleToSet(player.name);
      if (roleToSet) setRole(player, roleToSet);
    } catch (error) {}
  });
});