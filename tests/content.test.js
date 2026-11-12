import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";
import { validateTileMap } from "../src/content.js";

const root = resolve(".");
const readMap = async name => JSON.parse(await readFile(resolve(root, "data/maps", name + ".json"), "utf8"));

test("all world maps have valid dimensions, collision, spawn and exits", async () => {
  for (const name of ["village", "forest", "cave"]) {
    const map = await readMap(name);
    assert.equal(validateTileMap(map), true, name + " map must be valid");
  }
});

test("world exits form a connected village-forest-cave route", async () => {
  const village = await readMap("village");
  const forest = await readMap("forest");
  const cave = await readMap("cave");
  assert.ok(village.exits.some(exit => exit.to === "forest"));
  assert.ok(forest.exits.some(exit => exit.to === "village"));
  assert.ok(forest.exits.some(exit => exit.to === "cave"));
  assert.ok(cave.exits.some(exit => exit.to === "forest"));
});

test("service worker app-shell references existing local files", async () => {
  const sw = await readFile(resolve(root, "sw.js"), "utf8");
  const block = sw.match(/const APP_SHELL = \[([\s\S]*?)\];/);
  assert.ok(block, "APP_SHELL list must exist");
  const paths = [...block[1].matchAll(/"([^"]+)"/g)].map(match => match[1]).filter(path => path !== "./");
  for (const path of paths) await access(resolve(root, path));
});

test("browser entry point imports existing local modules", async () => {
  const html = await readFile(resolve(root, "index.html"), "utf8");
  const imports = [...html.matchAll(/^import .* from ['"](.+?)['"];?$/gm)].map(match => match[1]);
  assert.ok(imports.length >= 4);
  for (const path of imports) await access(resolve(root, path));
});
