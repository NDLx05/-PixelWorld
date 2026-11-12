import test from "node:test";
import assert from "node:assert/strict";
import { cameraFollow, moveWithObstacles, canUseCooldown, normalizeSave, SAVE_VERSION, findMapExit } from "../src/systems.js";

test("camera clamps to world edges", () => {
  assert.deepEqual(cameraFollow({x:5,y:5},{width:480,height:270},{width:960,height:720}),{x:0,y:0});
  assert.deepEqual(cameraFollow({x:950,y:710},{width:480,height:270},{width:960,height:720}),{x:480,y:450});
});

test("movement respects bounds", () => {
  const hero={x:12,y:12};
  moveWithObstacles(hero,-50,-50,[],{minX:10,maxX:950,minY:10,maxY:710});
  assert.deepEqual(hero,{x:10,y:10});
});

test("movement cannot pass through solid props", () => {
  const hero={x:20,y:50};
  moveWithObstacles(hero,20,0,[{x:40,y:50,radius:10}],{minX:0,maxX:100,minY:0,maxY:100},7);
  assert.equal(hero.x,20);
});

test("cooldown readiness uses zero threshold", () => {
  assert.equal(canUseCooldown(0),true);
  assert.equal(canUseCooldown(0.1),false);
});

test("legacy saves migrate into the current versioned shape", () => {
  const migrated = normalizeSave({version:2,at:123,hero:{wood:"4",stone:2,armor:"2",lv:3},world:"cave",nodes:[],enemies:[],worldStates:{forest:{nodes:[{x:2,y:3}],enemies:[]}}});
  assert.equal(migrated.version,SAVE_VERSION);
  assert.equal(migrated.savedAt,123);
  assert.equal(migrated.hero.wood,4);
  assert.equal(migrated.hero.armor,2);
  assert.equal(migrated.world,"cave");
  assert.equal(migrated.worldStates.forest.nodes.length,1);
});

test("invalid saves are rejected safely", () => {
  assert.equal(normalizeSave(null),null);
  assert.equal(normalizeSave({world:"forest"}),null);
});

test("movement respects solid map tiles and open passage tiles", () => {
  const map={tileSize:24,collision:[[1,0],[0,0]]};
  const hero={x:36,y:12};
  moveWithObstacles(hero,-20,0,[],{minX:0,maxX:48,minY:0,maxY:48},5,map);
  assert.equal(hero.x,36);
  moveWithObstacles(hero,0,20,[],{minX:0,maxX:48,minY:0,maxY:48},5,map);
  assert.equal(hero.y,32);
});

test("map exits activate only on their exact tile", () => {
  const map = { tileSize: 24, exits: [{ x: 39, y: 14, to: "forest" }] };
  assert.deepEqual(findMapExit(map, 950, 350), { x: 39, y: 14, to: "forest" });
  assert.equal(findMapExit(map, 950, 400), null);
  assert.equal(findMapExit(map, 920, 350), null);
  assert.equal(findMapExit(null, 950, 350), null);
});

test("save normalization repairs invalid stats and strips malformed world entities", () => {
  const normalized = normalizeSave({
    world: "cave",
    hero: { cls: "unknown", x: "NaN", y: 9999, hp: -20, mp: "bad", lv: 0, wood: "bad", coins: 2.8, quests: [] },
    nodes: [null, { x: 20, y: 30, hp: 2 }, { x: "bad", y: 4 }],
    enemies: [{ x: 40, y: 50, hp: "bad", max: 0 }],
    worldStates: { forest: { nodes: [false, { x: 2, y: 3 }], enemies: "broken" }, unknown: { nodes: [{ x: 1, y: 1 }] } },
    savedAt: "not-a-date"
  });
  assert.equal(normalized.hero.cls, "warrior");
  assert.equal(normalized.hero.x, 240);
  assert.equal(normalized.hero.y, 710);
  assert.equal(normalized.hero.hp, 0);
  assert.equal(normalized.hero.mp, 35);
  assert.equal(normalized.hero.lv, 1);
  assert.equal(normalized.hero.wood, 0);
  assert.equal(normalized.hero.coins, 2);
  assert.deepEqual(normalized.hero.quests, {});
  assert.equal(normalized.nodes.length, 1);
  assert.equal(normalized.enemies[0].hp, 0);
  assert.equal(normalized.enemies[0].max, 1);
  assert.equal(normalized.worldStates.forest.nodes.length, 1);
  assert.deepEqual(normalized.worldStates.forest.enemies, []);
  assert.equal("unknown" in normalized.worldStates, false);
  assert.ok(Number.isFinite(normalized.savedAt));
});

test("save normalization caps extreme progression values", () => {
  const normalized = normalizeSave({
    hero: { cls: "ranger", hp: 99999, mp: 99999, lv: 99999, xp: Number.MAX_SAFE_INTEGER, coins: Number.MAX_SAFE_INTEGER }
  });
  assert.equal(normalized.hero.hp, 105);
  assert.equal(normalized.hero.mp, 65);
  assert.equal(normalized.hero.lv, 999);
  assert.equal(normalized.hero.xp, 1000000);
  assert.equal(normalized.hero.coins, 999999);
});
