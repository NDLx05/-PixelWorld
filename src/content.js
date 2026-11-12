const DATA_FILES = {
  items: "./data/items.json",
  recipes: "./data/recipes.json",
  skills: "./data/skills.json",
  quests: "./data/quests.json",
  forestMap: "./data/maps/forest.json",
  caveMap: "./data/maps/cave.json",
  villageMap: "./data/maps/village.json",
  enemies: "./data/enemies.json",
  shops: "./data/shops.json"
};

export function validateTileMap(map) {
  if (!map || typeof map !== "object") return false;
  const { width, height, tileSize, terrain, collision, spawn, exits } = map;
  if (!Number.isInteger(width) || width < 1 || !Number.isInteger(height) || height < 1) return false;
  if (!Number.isFinite(tileSize) || tileSize <= 0) return false;
  if (!Array.isArray(terrain) || terrain.length !== height || !Array.isArray(collision) || collision.length !== height) return false;
  if (!terrain.every(row => Array.isArray(row) && row.length === width && row.every(Number.isInteger))) return false;
  if (!collision.every(row => Array.isArray(row) && row.length === width && row.every(cell => cell === 0 || cell === 1))) return false;
  if (!spawn || !Number.isFinite(spawn.x) || !Number.isFinite(spawn.y)) return false;
  const sx = Math.floor(spawn.x / tileSize), sy = Math.floor(spawn.y / tileSize);
  if (sx < 0 || sx >= width || sy < 0 || sy >= height || collision[sy][sx] !== 0) return false;
  if (!Array.isArray(exits) || !exits.every(exit => Number.isInteger(exit.x) && Number.isInteger(exit.y) && exit.x >= 0 && exit.x < width && exit.y >= 0 && exit.y < height && collision[exit.y][exit.x] === 0 && typeof exit.to === "string" && exit.to.length > 0)) return false;
  return true;
}

async function readJson(path) {
  const response = await fetch(path, { cache: "no-cache" });
  if (!response.ok) throw new Error(`Cannot load ${path}: ${response.status}`);
  return response.json();
}

export async function loadGameContent() {
  const entries = await Promise.all(Object.entries(DATA_FILES).map(async ([key, path]) => {
    try { return [key, await readJson(path)]; }
    catch (error) { console.warn("PixelWorld content fallback:", error); return [key, null]; }
  }));
  const content = Object.fromEntries(entries);
  if (content.items && !Array.isArray(content.items.items)) content.items = null;
  if (content.recipes && !Array.isArray(content.recipes.recipes)) content.recipes = null;
  if (content.skills && (!content.skills.classes || typeof content.skills.classes !== "object")) content.skills = null;
  if (content.quests && (!Array.isArray(content.quests.npcs) || !Array.isArray(content.quests.quests))) content.quests = null;
  if (content.enemies && (!content.enemies.types || typeof content.enemies.types !== "object")) content.enemies = null;
  if (content.shops && !Array.isArray(content.shops.shops)) content.shops = null;
  for (const key of ["forestMap", "caveMap", "villageMap"]) { if (content[key] && !validateTileMap(content[key])) { console.warn("PixelWorld invalid map:", key); content[key] = null; } }
  return content;
}
