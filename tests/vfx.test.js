import test from "node:test";
import assert from "node:assert/strict";
import { PixelVFX } from "../src/vfx.js";

test("pixel effects create particles and timed effects", () => {
  const fx = new PixelVFX({ seed: 7 });
  fx.slash(10, 20, { x: 1, y: 0 });
  fx.impact(12, 20);
  assert.equal(fx.effects.length, 2);
  assert.ok(fx.particles.length > 0);
});

test("effect updates expire cleanly", () => {
  const fx = new PixelVFX({ seed: 9 });
  fx.levelUp(30, 40);
  fx.update(0.05);
  assert.ok(fx.effects.length > 0);
  fx.update(1);
  assert.equal(fx.effects.length, 0);
  assert.equal(fx.particles.length, 0);
});

test("particle count remains bounded and clear resets state", () => {
  const fx = new PixelVFX({ maxParticles: 12, seed: 11 });
  fx.burst(0, 0, ["#fff", "#f00"], 40);
  assert.equal(fx.particles.length, 12);
  fx.clear();
  assert.equal(fx.particles.length, 0);
  assert.equal(fx.effects.length, 0);
});
