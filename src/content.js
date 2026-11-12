const DATA_FILES = {
  items: "./data/items.json",
  recipes: "./data/recipes.json",
  skills: "./data/skills.json",
  quests: "./data/quests.json",
  forestMap: "./data/maps/forest.json",
  caveMap: "./data/maps/cave.json",
  enemies: "./data/enemies.json",
  shops: "./data/shops.json"
};

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
  for (const key of ["forestMap", "caveMap"]) { const map = content[key]; if (map && (!Array.isArray(map.terrain) || !Array.isArray(map.collision) || !Number.isFinite(map.tileSize))) content[key] = null; }
  return content;
}
