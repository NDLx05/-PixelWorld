import test from "node:test";
import assert from "node:assert/strict";
import { tileSeed } from "../src/tile-renderer.js";

test("terrain decoration seed is stable for each tile", () => {
  assert.equal(tileSeed(4,9,1),tileSeed(4,9,1));
});

test("adjacent tiles get distinct deterministic decoration patterns", () => {
  assert.notEqual(tileSeed(4,9,1),tileSeed(5,9,1));
  assert.notEqual(tileSeed(4,9,1),tileSeed(4,9,2));
});
