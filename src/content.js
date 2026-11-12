const DATA_FILES = {
  items: "./data/items.json",
  recipes: "./data/recipes.json",
  skills: "./data/skills.json"
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
  return content;
}
