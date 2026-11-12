export const SAVE_KEY = "pixelworld-save";
export const SAVE_VERSION = 4;

const clone = value => JSON.parse(JSON.stringify(value));

export function normalizeSave(raw) {
  if (!raw || typeof raw !== "object" || !raw.hero) return null;
  const hero = { ...raw.hero };
  for (const key of ["wood", "stone", "crystal", "coins", "potion", "weapon", "axe", "armor", "xp", "lv"]) {
    const n = Number(hero[key] ?? (key === "lv" ? 1 : 0));
    hero[key] = Number.isFinite(n) ? Math.max(0, n) : 0;
  }
  return {
    version: SAVE_VERSION,
    hero,
    world: ["village", "forest", "cave"].includes(raw.world) ? raw.world : "village",
    nodes: Array.isArray(raw.nodes) ? raw.nodes : [],
    enemies: Array.isArray(raw.enemies) ? raw.enemies : [],
    worldStates: raw.worldStates && typeof raw.worldStates === "object" ? raw.worldStates : {},
    savedAt: Number(raw.savedAt ?? raw.at ?? Date.now())
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
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Cannot open save database"));
      request.onblocked = () => reject(new Error("Save database upgrade is blocked"));
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
