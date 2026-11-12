import test from "node:test";
import assert from "node:assert/strict";
import { updateEnemyAI } from "../src/enemy-ai.js";

test("enemy stays idle outside its detection radius", () => {
  const enemy = { x: 0, y: 0, hp: 10, max: 10 };
  const result = updateEnemyAI(enemy, { x: 300, y: 0 }, 0.2, { speed: 30 });
  assert.equal(result.state, "idle");
  assert.equal(enemy.state, "idle");
  assert.equal(result.moveX, 0);
});

test("enemy changes to chase and moves toward the player", () => {
  const enemy = { x: 0, y: 0, hp: 10, max: 10 };
  const result = updateEnemyAI(enemy, { x: 60, y: 0 }, 0.1, { speed: 30 });
  assert.equal(result.state, "chase");
  assert.equal(result.moveX, 30);
  assert.equal(result.moveY, 0);
});

test("enemy enters attack state inside melee range", () => {
  const enemy = { x: 0, y: 0, hp: 10, max: 10 };
  const result = updateEnemyAI(enemy, { x: 10, y: 0 }, 0.1);
  assert.equal(result.state, "attack");
  assert.equal(result.moveX, 0);
});

test("weak nearby enemies retreat while bosses hold their ground", () => {
  const enemy = { x: 0, y: 0, hp: 1, max: 10 };
  const result = updateEnemyAI(enemy, { x: 30, y: 0 }, 0.1, { speed: 25 });
  assert.equal(result.state, "retreat");
  assert.ok(result.moveX < 0);
  const boss = { x: 0, y: 0, hp: 1, max: 10, isBoss: true };
  assert.equal(updateEnemyAI(boss, { x: 30, y: 0 }, 0.1).state, "chase");
});

test("boss enters phase two below half health", () => {
  const boss = { x: 0, y: 0, hp: 40, max: 100, isBoss: true };
  const result = updateEnemyAI(boss, { x: 100, y: 0 }, 0.1, { speed: 30 });
  assert.equal(result.state, "chase");
  assert.equal(result.moveX, 36);
});

test("defeated enemies stop moving", () => {
  const enemy = { x: 0, y: 0, hp: 0, max: 10 };
  const result = updateEnemyAI(enemy, { x: 20, y: 0 });
  assert.equal(result.state, "dead");
  assert.equal(result.moveX, 0);
});
