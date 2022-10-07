import { BlockLocation, world } from "mojang-minecraft";

/*
|--------------------------------------------------------------------------
| Max Databse string size
|--------------------------------------------------------------------------
|
| Here is the max database save size meaing when a save gets made
| it tests the size of that save and splits up the save depending on this
| Size. Its releated to minecrafts 32k bit limit.
|
*/
export const MAX_DATABASE_STRING_SIZE = 32000;

/*
|--------------------------------------------------------------------------
| Data regex
|--------------------------------------------------------------------------
|
| This is the regex to extract data from the data storage template
|
*/
export const DATA_REGEX = /(?<=\|\d*\|)(.*)/;

/*
|--------------------------------------------------------------------------
| Entity Id
|--------------------------------------------------------------------------
|
| This is the entity id of the database this is what stores the information
| of the database on its nameTag
|
*/
export const ENTITY_ID = "rubedo:database";

/*
|--------------------------------------------------------------------------
| Entity Spawn Dimension
|--------------------------------------------------------------------------
|
| This is the dimension where the database entitys are located
|
*/
export const ENTITY_SPAWN_DIMENSION = world.getDimension("overworld");

/*
|--------------------------------------------------------------------------
| Entity Spawn Location
|--------------------------------------------------------------------------
|
| This is the spawn location of the database entitys there will be
| Multiple entitys at this location for each chunk
|
*/
export const ENTITY_SPAWN_LOCATION = new BlockLocation(0, -64, 0);
