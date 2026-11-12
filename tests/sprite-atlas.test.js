import test from "node:test";
import assert from "node:assert/strict";
import { HERO_SPRITES, ENEMY_SPRITES, animationState, animationFrame } from "../src/sprite-atlas.js";

test("hero classes map to the uploaded detailed sprite sheets", () => {
  assert.deepEqual(HERO_SPRITES, { warrior: "warrior", mage: "mage", ranger: "archer" });
});

test("all current enemy kinds have a matching uploaded sprite", () => {
  for (const kind of ["slime", "bat", "wolf", "skeleton", "goblin", "spider", "imp", "guardian"]) {
    assert.ok(ENEMY_SPRITES[kind], `missing sprite for ${kind}`);
  }
});

test("animation state prioritizes death, hurt, attack, then movement", () => {
  assert.equal(animationState({ dead: true, hurt: true }), "die");
  assert.equal(animationState({ hurt: true, attacking: true }), "hurt");
  assert.equal(animationState({ attacking: true, moving: true }), "attack");
  assert.equal(animationState({ moving: true }), "walk");
  assert.equal(animationState({}), "idle");
});

test("animation frames loop using the configured frame rate", () => {
  assert.equal(animationFrame(0, 12, 10), 0);
  assert.equal(animationFrame(250, 12, 10), 3);
  assert.equal(animationFrame(1000, 12, 10), 2);
});
