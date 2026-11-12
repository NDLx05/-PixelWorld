import test from "node:test";
import assert from "node:assert/strict";
import { applyLevelUps, calculateIncomingDamage } from "../src/progression.js";

test("level progression consumes each threshold and restores bounded health and mana", () => {
  const hero = { lv: 1, xp: 135, hp: 20, mp: 5 };
  const gained = applyLevelUps(hero, { hp: 100, mp: 80 });
  assert.equal(gained, 2);
  assert.deepEqual(hero, { lv: 3, xp: 0, hp: 70, mp: 45 });
});

test("level progression stops at the configured level cap", () => {
  const hero = { lv: 2, xp: 100000, hp: 10, mp: 10 };
  assert.equal(applyLevelUps(hero, { hp: 50, mp: 40 }, 3), 1);
  assert.equal(hero.lv, 3);
  assert.equal(hero.xp, 99910);
  assert.equal(applyLevelUps(hero, { hp: 50, mp: 40 }, 3), 0);
});

test("incoming damage applies armor and guard reduction with a minimum of one", () => {
  assert.equal(calculateIncomingDamage(12, 2), 8);
  assert.equal(calculateIncomingDamage(3, 1), 1);
  assert.equal(calculateIncomingDamage(16, 2, 4), 8);
});

test("invalid damage inputs fall back safely", () => {
  assert.equal(calculateIncomingDamage("bad", "bad"), 1);
  assert.equal(calculateIncomingDamage(8, -5), 8);
});
