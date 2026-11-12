export const SAVE_KEY = "pixelworld-save";
export const SAVE_VERSION = 4;

const clone = value => JSON.parse(JSON.stringify(value));

export function normalizeSave(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw) || !raw.hero || typeof raw.hero !== "object" || Array.isArray(raw.hero)) return null;
  const hero = { ...raw.hero };
  const number = (value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
  };
  const cls = ["warrior", "mage", "ranger"].includes(hero.cls) ? hero.cls : "warrior";
  const limits = {
    warrior: { hp: 140, mp: 35 },
    mage: { hp: 90, mp: 100 },
    ranger: { hp: 105, mp: 65 }
  }[cls];
  hero.cls = cls;
  hero.x = number(hero.x, 240, 10, 950);
  hero.y = number(hero.y, 135, 10, 710);
  hero.hp = number(hero.hp, limits.hp, 0, limits.hp);
  hero.mp = number(hero.mp, limits.mp, 0, limits.mp);
  for (const key of ["wood", "stone", "crystal", "coins", "potion", "weapon", "axe", "armor", "xp"]) {
    hero[key] = Math.floor(number(hero[key], 0, 0, key === "xp" ? 1000000 : 999999));
  }
  hero.lv = Math.floor(number(hero.lv, 1, 1, 999));
  hero.quests = hero.quests && typeof hero.quests === "object" && !Array.isArray(hero.quests) ? hero.quests : {};
  hero.guardianDefeated = hero.guardianDefeated ? 1 : 0;

  const cleanEntities = list => Array.isArray(list) ? list.filter(item =>
    item && typeof item === "object" && !Array.isArray(item) &&
    Number.isFinite(Number(item.x)) && Number.isFinite(Number(item.y))
  ).map(item => ({
    ...item,
    x: number(item.x, 0, 0, 960),
    y: number(item.y, 0, 0, 720),
    ...(item.hp !== undefined ? { hp: number(item.hp, 0) } : {}),
    ...(item.max !== undefined ? { max: number(item.max, 1, 1) } : {})
  })) : [];
  const worldStates = {};
  if (raw.worldStates && typeof raw.worldStates === "object" && !Array.isArray(raw.worldStates)) {
    for (const area of ["village", "forest", "cave"]) {
      const state = raw.worldStates[area];
      if (state && typeof state === "object" && !Array.isArray(state)) {
        worldStates[area] = { nodes: cleanEntities(state.nodes), enemies: cleanEntities(state.enemies) };
      }
    }
  }
  const savedAt = number(raw.savedAt ?? raw.at, Date.now(), 0);
  return {
    version: SAVE_VERSION,
    hero,
    world: ["village", "forest", "cave"].includes(raw.world) ? raw.world : "village",
    nodes: cleanEntities(raw.nodes),
    enemies: cleanEntities(raw.enemies),
    worldStates,
    savedAt
  };
}

/** IndexedDB-first save storage with localStorage fallback and v2 migration. */
export class SaveStore {
  constructor({ database = "pixelworld-db", store = "saves", key = "main" } = {}) {
    this.database = database;
    this.store = store;
    this.key = key;
    this.dbPromise = null;
  }

  open() {
    if (!("indexedDB" in globalThis)) return Promise.reject(new Error("IndexedDB unavailable"));
    if (this.dbPromise) return this.dbPromise;
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.database, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.store)) db.createObjectStore(this.store);
      };
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => { db.close(); this.dbPromise = null; };
        resolve(db);
      };
      request.onerror = () => reject(request.error || new Error("Cannot open save database"));
      request.onblocked = () => reject(new Error("Save database upgrade is blocked"));
    }).catch(error => {
      this.dbPromise = null;
      throw error;
    });
    return this.dbPromise;
  }

  async readIndexed() {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.store, "readonly");
      const request = tx.objectStore(this.store).get(this.key);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error || new Error("Cannot read save"));
    });
  }

  async writeIndexed(value) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.store, "readwrite");
      tx.objectStore(this.store).put(value, this.key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error || new Error("Cannot write save"));
      tx.onabort = () => reject(tx.error || new Error("Save transaction aborted"));
    });
  }

  async save(state) {
    const data = normalizeSave({ ...clone(state), version: SAVE_VERSION, savedAt: Date.now() });
    if (!data) throw new Error("Invalid save data");
    try {
      await this.writeIndexed(data);
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch {}
      return { storage: "indexeddb", savedAt: data.savedAt };
    } catch (error) {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        return { storage: "localStorage", savedAt: data.savedAt, warning: String(error) };
      } catch {
        throw new Error("Không thể lưu game: IndexedDB và localStorage đều không khả dụng.");
      }
    }
  }

  async load() {
    try {
      const data = normalizeSave(await this.readIndexed());
      if (data) return data;
    } catch {}
    try {
      const legacy = localStorage.getItem(SAVE_KEY);
      if (!legacy) return null;
      const data = normalizeSave(JSON.parse(legacy));
      if (!data) return null;
      // Upgrade legacy localStorage saves to IndexedDB when possible.
      try { await this.writeIndexed(data); } catch {}
      return data;
    } catch {
      return null;
    }
  }

  async clear() {
    try {
      const db = await this.open();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(this.store, "readwrite");
        tx.objectStore(this.store).delete(this.key);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    } finally {
      try { localStorage.removeItem(SAVE_KEY); } catch {}
    }
  }
}

/** Axis-separated movement against circular world props and rectangular world bounds. */
export function moveWithObstacles(entity, dx, dy, obstacles, bounds, radius = 7, map = null) {
  const blocked = (x, y) => {
    if (map?.collision && map.tileSize) {
      const minX = Math.floor((x - radius) / map.tileSize);
      const maxX = Math.floor((x + radius) / map.tileSize);
      const minY = Math.floor((y - radius) / map.tileSize);
      const maxY = Math.floor((y + radius) / map.tileSize);
      for (let ty = minY; ty <= maxY; ty++) for (let tx = minX; tx <= maxX; tx++) {
        if (map.collision[ty]?.[tx]) return true;
      }
    }
    return obstacles.some(o => {
      const r = radius + (o.radius ?? 9);
      const ox = x - o.x, oy = y - o.y;
      return ox * ox + oy * oy < r * r;
    });
  };
  const nx = Math.max(bounds.minX, Math.min(bounds.maxX, entity.x + dx));
  if (!blocked(nx, entity.y)) entity.x = nx;
  const ny = Math.max(bounds.minY, Math.min(bounds.maxY, entity.y + dy));
  if (!blocked(entity.x, ny)) entity.y = ny;
  return entity;
}

export function cameraFollow(target, viewport, world) {
  return {
    x: Math.max(0, Math.min(world.width - viewport.width, target.x - viewport.width / 2)),
    y: Math.max(0, Math.min(world.height - viewport.height, target.y - viewport.height / 2))
  };
}

export function canUseCooldown(remaining) {
  return Number(remaining) <= 0;
}

/** Return the destination for the exact walkable exit tile under a world position. */
export function findMapExit(map, x, y) {
  if (!map || !Number.isFinite(map.tileSize) || map.tileSize <= 0 || !Array.isArray(map.exits)) return null;
  const tileX = Math.floor(x / map.tileSize);
  const tileY = Math.floor(y / map.tileSize);
  return map.exits.find(exit => exit.x === tileX && exit.y === tileY) || null;
}
