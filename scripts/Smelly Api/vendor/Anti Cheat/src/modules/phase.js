import { SA } from "../../../../index.js";
import { PlayerLog } from "../Models/PlayerLog.js";
import { forEachValidPlayer } from "../utils";
import { PreviousLocation as PrevLo } from "../Models/PreviousLocation.js";

/**
 * Minecraft Bedrock Anti Phase
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This is a anti phase system. It works by getting the block the player is in
 * every tick. If the block there in is a FULL_BLOCK it will tp the player to
 * there last position where they wernt in one of those blocks
 * --------------------------------------------------------------------------
 */

/**
 * Stores Last Previous grounded location
 */
const log = new PlayerLog();

/**
 * List of blocks that are full, there unit_cubed
 */
export const FULL_BLOCKS = [
  "minecraft:allow",
  "minecraft:amethyst_block",
  "minecraft:ancient_debris",
  "minecraft:barrel",
  "minecraft:barrier",
  "minecraft:basalt",
  "minecraft:beacon",
  "minecraft:bedrock",
  "minecraft:bee_nest",
  "minecraft:beehive",
  "minecraft:big_dripleaf",
  "minecraft:black_glazed_terracotta",
  "minecraft:blackstone",
  "minecraft:blackstone_double_slab",
  "minecraft:blast_furnace",
  "minecraft:blue_glazed_terracotta",
  "minecraft:blue_ice",
  "minecraft:bone_block",
  "minecraft:bookshelf",
  "minecraft:brick_block",
  "minecraft:brown_glazed_terracotta",
  "minecraft:brown_mushroom_block",
  "minecraft:budding_amethyst",
  "minecraft:calcite",
  "minecraft:cartography_table",
  "minecraft:carved_pumpkin",
  "minecraft:chain_command_block",
  "minecraft:chemical_heat",
  "minecraft:chiseled_deepslate",
  "minecraft:chiseled_nether_bricks",
  "minecraft:chiseled_polished_blackstone",
  "minecraft:clay",
  "minecraft:client_request_placeholder_block",
  "minecraft:coal_block",
  "minecraft:coal_ore",
  "minecraft:cobbled_deepslate",
  "minecraft:cobbled_deepslate_double_slab",
  "minecraft:cobblestone",
  "minecraft:command_block",
  "minecraft:concrete",
  "minecraft:copper_block",
  "minecraft:copper_ore",
  "minecraft:coral_block",
  "minecraft:cracked_deepslate_bricks",
  "minecraft:cracked_deepslate_tiles",
  "minecraft:cracked_nether_bricks",
  "minecraft:cracked_polished_blackstone_bricks",
  "minecraft:crafting_table",
  "minecraft:crimson_double_slab",
  "minecraft:crimson_hyphae",
  "minecraft:crimson_nylium",
  "minecraft:crimson_planks",
  "minecraft:crimson_stem",
  "minecraft:crying_obsidian",
  "minecraft:cut_copper",
  "minecraft:cyan_glazed_terracotta",
  "minecraft:daylight_detector",
  "minecraft:deepslate",
  "minecraft:deepslate_brick_double_slab",
  "minecraft:deepslate_bricks",
  "minecraft:deepslate_coal_ore",
  "minecraft:deepslate_copper_ore",
  "minecraft:deepslate_diamond_ore",
  "minecraft:deepslate_emerald_ore",
  "minecraft:deepslate_gold_ore",
  "minecraft:deepslate_iron_ore",
  "minecraft:deepslate_lapis_ore",
  "minecraft:deepslate_redstone_ore",
  "minecraft:deepslate_tile_double_slab",
  "minecraft:deepslate_tiles",
  "minecraft:deny",
  "minecraft:diamond_block",
  "minecraft:diamond_ore",
  "minecraft:dirt",
  "minecraft:dirt_with_roots",
  "minecraft:dispenser",
  "minecraft:double_cut_copper_slab",
  "minecraft:double_stone_slab",
  "minecraft:double_stone_slab2",
  "minecraft:double_stone_slab3",
  "minecraft:double_stone_slab4",
  "minecraft:double_wooden_slab",
  "minecraft:dried_kelp_block",
  "minecraft:dripstone_block",
  "minecraft:dropper",
  "minecraft:element_0",
  "minecraft:element_1",
  "minecraft:element_10",
  "minecraft:element_100",
  "minecraft:element_101",
  "minecraft:element_102",
  "minecraft:element_103",
  "minecraft:element_104",
  "minecraft:element_105",
  "minecraft:element_106",
  "minecraft:element_107",
  "minecraft:element_108",
  "minecraft:element_109",
  "minecraft:element_11",
  "minecraft:element_110",
  "minecraft:element_111",
  "minecraft:element_112",
  "minecraft:element_113",
  "minecraft:element_114",
  "minecraft:element_115",
  "minecraft:element_116",
  "minecraft:element_117",
  "minecraft:element_118",
  "minecraft:element_12",
  "minecraft:element_13",
  "minecraft:element_14",
  "minecraft:element_15",
  "minecraft:element_16",
  "minecraft:element_17",
  "minecraft:element_18",
  "minecraft:element_19",
  "minecraft:element_2",
  "minecraft:element_20",
  "minecraft:element_21",
  "minecraft:element_22",
  "minecraft:element_23",
  "minecraft:element_24",
  "minecraft:element_25",
  "minecraft:element_26",
  "minecraft:element_27",
  "minecraft:element_28",
  "minecraft:element_29",
  "minecraft:element_3",
  "minecraft:element_30",
  "minecraft:element_31",
  "minecraft:element_32",
  "minecraft:element_33",
  "minecraft:element_34",
  "minecraft:element_35",
  "minecraft:element_36",
  "minecraft:element_37",
  "minecraft:element_38",
  "minecraft:element_39",
  "minecraft:element_4",
  "minecraft:element_40",
  "minecraft:element_41",
  "minecraft:element_42",
  "minecraft:element_43",
  "minecraft:element_44",
  "minecraft:element_45",
  "minecraft:element_46",
  "minecraft:element_47",
  "minecraft:element_48",
  "minecraft:element_49",
  "minecraft:element_5",
  "minecraft:element_50",
  "minecraft:element_51",
  "minecraft:element_52",
  "minecraft:element_53",
  "minecraft:element_54",
  "minecraft:element_55",
  "minecraft:element_56",
  "minecraft:element_57",
  "minecraft:element_58",
  "minecraft:element_59",
  "minecraft:element_6",
  "minecraft:element_60",
  "minecraft:element_61",
  "minecraft:element_62",
  "minecraft:element_63",
  "minecraft:element_64",
  "minecraft:element_65",
  "minecraft:element_66",
  "minecraft:element_67",
  "minecraft:element_68",
  "minecraft:element_69",
  "minecraft:element_7",
  "minecraft:element_70",
  "minecraft:element_71",
  "minecraft:element_72",
  "minecraft:element_73",
  "minecraft:element_74",
  "minecraft:element_75",
  "minecraft:element_76",
  "minecraft:element_77",
  "minecraft:element_78",
  "minecraft:element_79",
  "minecraft:element_8",
  "minecraft:element_80",
  "minecraft:element_81",
  "minecraft:element_82",
  "minecraft:element_83",
  "minecraft:element_84",
  "minecraft:element_85",
  "minecraft:element_86",
  "minecraft:element_87",
  "minecraft:element_88",
  "minecraft:element_89",
  "minecraft:element_9",
  "minecraft:element_90",
  "minecraft:element_91",
  "minecraft:element_92",
  "minecraft:element_93",
  "minecraft:element_94",
  "minecraft:element_95",
  "minecraft:element_96",
  "minecraft:element_97",
  "minecraft:element_98",
  "minecraft:element_99",
  "minecraft:emerald_block",
  "minecraft:emerald_ore",
  "minecraft:end_bricks",
  "minecraft:end_stone",
  "minecraft:exposed_copper",
  "minecraft:exposed_cut_copper",
  "minecraft:exposed_double_cut_copper_slab",
  "minecraft:fletching_table",
  "minecraft:furnace",
  "minecraft:gilded_blackstone",
  "minecraft:glowingobsidian",
  "minecraft:gold_block",
  "minecraft:gold_ore",
  "minecraft:grass",
  "minecraft:gray_glazed_terracotta",
  "minecraft:green_glazed_terracotta",
  "minecraft:hardened_clay",
  "minecraft:hay_block",
  "minecraft:honey_block",
  "minecraft:honeycomb_block",
  "minecraft:infested_deepslate",
  "minecraft:info_update",
  "minecraft:info_update2",
  "minecraft:iron_block",
  "minecraft:iron_ore",
  "minecraft:jigsaw",
  "minecraft:lapis_block",
  "minecraft:lapis_ore",
  "minecraft:light_blue_glazed_terracotta",
  "minecraft:lime_glazed_terracotta",
  "minecraft:lit_blast_furnace",
  "minecraft:lit_deepslate_redstone_ore",
  "minecraft:lit_furnace",
  "minecraft:lit_pumpkin",
  "minecraft:lit_redstone_lamp",
  "minecraft:lit_redstone_ore",
  "minecraft:lit_smoker",
  "minecraft:lodestone",
  "minecraft:log",
  "minecraft:log2",
  "minecraft:loom",
  "minecraft:magenta_glazed_terracotta",
  "minecraft:magma",
  "minecraft:melon_block",
  "minecraft:mob_spawner",
  "minecraft:monster_egg",
  "minecraft:moss_block",
  "minecraft:mossy_cobblestone",
  "minecraft:mud",
  "minecraft:mud_brick_double_slab",
  "minecraft:mud_bricks",
  "minecraft:mycelium",
  "minecraft:nether_brick",
  "minecraft:nether_gold_ore",
  "minecraft:nether_wart_block",
  "minecraft:netherite_block",
  "minecraft:netherrack",
  "minecraft:netherreactor",
  "minecraft:noteblock",
  "minecraft:obsidian",
  "minecraft:ochre_froglight",
  "minecraft:orange_glazed_terracotta",
  "minecraft:oxidized_copper",
  "minecraft:oxidized_cut_copper",
  "minecraft:oxidized_double_cut_copper_slab",
  "minecraft:packed_ice",
  "minecraft:packed_mud",
  "minecraft:pearlescent_froglight",
  "minecraft:pink_glazed_terracotta",
  "minecraft:planks",
  "minecraft:podzol",
  "minecraft:polished_basalt",
  "minecraft:polished_blackstone",
  "minecraft:polished_blackstone_brick_double_slab",
  "minecraft:polished_blackstone_bricks",
  "minecraft:polished_blackstone_double_slab",
  "minecraft:polished_deepslate",
  "minecraft:polished_deepslate_double_slab",
  "minecraft:prismarine",
  "minecraft:pumpkin",
  "minecraft:purple_glazed_terracotta",
  "minecraft:purpur_block",
  "minecraft:quartz_block",
  "minecraft:quartz_bricks",
  "minecraft:quartz_ore",
  "minecraft:raw_copper_block",
  "minecraft:raw_gold_block",
  "minecraft:raw_iron_block",
  "minecraft:red_glazed_terracotta",
  "minecraft:red_mushroom_block",
  "minecraft:red_nether_brick",
  "minecraft:red_sandstone",
  "minecraft:redstone_block",
  "minecraft:redstone_lamp",
  "minecraft:redstone_ore",
  "minecraft:redstone_wire",
  "minecraft:reinforced_deepslate",
  "minecraft:repeating_command_block",
  "minecraft:reserved6",
  "minecraft:respawn_anchor",
  "minecraft:sandstone",
  "minecraft:sculk",
  "minecraft:sculk_catalyst",
  "minecraft:sea_lantern",
  "minecraft:shroomlight",
  "minecraft:silver_glazed_terracotta",
  "minecraft:slime",
  "minecraft:smithing_table",
  "minecraft:smoker",
  "minecraft:smooth_basalt",
  "minecraft:smooth_stone",
  "minecraft:snow",
  "minecraft:soul_sand",
  "minecraft:soul_soil",
  "minecraft:sponge",
  "minecraft:stained_hardened_clay",
  "minecraft:stone",
  "minecraft:stonebrick",
  "minecraft:stonecutter",
  "minecraft:stripped_acacia_log",
  "minecraft:stripped_birch_log",
  "minecraft:stripped_crimson_hyphae",
  "minecraft:stripped_crimson_stem",
  "minecraft:stripped_dark_oak_log",
  "minecraft:stripped_jungle_log",
  "minecraft:stripped_oak_log",
  "minecraft:stripped_spruce_log",
  "minecraft:stripped_warped_hyphae",
  "minecraft:stripped_warped_stem",
  "minecraft:target",
  "minecraft:tuff",
  "minecraft:unknown",
  "minecraft:verdant_froglight",
  "minecraft:warped_double_slab",
  "minecraft:warped_hyphae",
  "minecraft:warped_nylium",
  "minecraft:warped_planks",
  "minecraft:warped_stem",
  "minecraft:warped_wart_block",
  "minecraft:waxed_copper",
  "minecraft:waxed_cut_copper",
  "minecraft:waxed_double_cut_copper_slab",
  "minecraft:waxed_exposed_copper",
  "minecraft:waxed_exposed_cut_copper",
  "minecraft:waxed_exposed_double_cut_copper_slab",
  "minecraft:waxed_oxidized_copper",
  "minecraft:waxed_oxidized_cut_copper",
  "minecraft:waxed_oxidized_double_cut_copper_slab",
  "minecraft:waxed_weathered_copper",
  "minecraft:waxed_weathered_cut_copper",
  "minecraft:waxed_weathered_double_cut_copper_slab",
  "minecraft:weathered_copper",
  "minecraft:weathered_cut_copper",
  "minecraft:weathered_double_cut_copper_slab",
  "minecraft:white_glazed_terracotta",
  "minecraft:wood",
  "minecraft:wool",
  "minecraft:yellow_glazed_terracotta",
];

forEachValidPlayer((player, { currentTick }) => {
  const block = player.dimension.getBlock(
    SA.Models.entity.locationToBlockLocation(player.location)
  );
  const get = () => log.get(player) ?? new PrevLo(player, currentTick, log);
  if (!FULL_BLOCKS.includes(block.id)) return get().update();
  // Player is inside a block
  get().back();
}, 20);
