import test from "node:test";
import assert from "node:assert/strict";
import { createProjectile, findMeleeTarget } from "../src/combat.js";

test("melee targeting selects the closest enemy in front and inside the attack arc", () => {
  const hero = { x: 100, y: 100 };
  const facing = { x: 1, y: 0 };
  const enemies = [
    { x: 145, y: 100, id: "far" },
    { x: 125, y: 105, id: "near" },
    { x: 115, y: 130, id: "outside-arc" },
    { x: 90, y: 100, id: "behind" }
  ];
  assert.equal(findMeleeTarget(hero, enemies, facing).id, "near");
});

test("melee targeting returns null when no enemy is in range", () => {
  assert.equal(findMeleeTarget({ x: 0, y: 0 }, [{ x: 100, y: 0 }], { x: 1, y: 0 }), null);
});

test("projectiles aim at the selected target and preserve combat properties", () => {
  const projectile = createProjectile(
    { x: 10, y: 20 },
    { x: 10, y: 30 },
    { x: 1, y: 0 },
    200,
    7,
    "bolt"
  );
  assert.deepEqual(projectile, {
    x: 10, y: 20, vx: 0, vy: 200, damage: 7, kind: "bolt", ttl: 2
  });
});

test("projectiles use facing direction when no target exists", () => {
  const projectile = createProjectile(
    { x: 5, y: 5 }, null, { x: -1, y: 0 }, 100, 3, "arrow"
  );
  assert.equal(projectile.vx, -100);
  assert.equal(projectile.vy, 0);
});
