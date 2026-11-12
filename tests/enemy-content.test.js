import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { updateEnemyAI } from "../src/enemy-ai.js";

const definitions = JSON.parse(await readFile(new URL("../data/enemies.json", import.meta.url), "utf8")).types;

test("slimes retreat at low health while bats keep pursuing", () => {
  const slime = { x: 0, y: 0, hp: 2, max: 10 };
  const bat = { x: 0, y: 0, hp: 1, max: 10 };
  assert.equal(updateEnemyAI(slime, { x: 50, y: 0 }, 0.1, definitions.slime).state, "retreat");
  assert.equal(updateEnemyAI(bat, { x: 30, y: 0 }, 0.1, definitions.bat).state, "chase");
});

test("bats detect the player farther away than slimes", () => {
  const slime = { x: 0, y: 0, hp: 10, max: 10 };
  const bat = { x: 0, y: 0, hp: 10, max: 10 };
  assert.equal(updateEnemyAI(slime, { x: 150, y: 0 }, 0.1, definitions.slime).state, "idle");
  assert.equal(updateEnemyAI(bat, { x: 150, y: 0 }, 0.1, definitions.bat).state, "chase");
});

test("crystal guardian has a longer aggro range but does not retreat", () => {
  const boss = { x: 0, y: 0, hp: 5, max: 90, isBoss: true };
  assert.equal(updateEnemyAI(boss, { x: 230, y: 0 }, 0.1, definitions.crystal_guardian).state, "chase");
  assert.equal(updateEnemyAI(boss, { x: 300, y: 0 }, 0.1, definitions.crystal_guardian).state, "idle");
});
