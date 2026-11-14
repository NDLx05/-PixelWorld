/* PixelWorld offline app shell. Bump CACHE_VERSION whenever app files change. */
const CACHE_VERSION = "pixelworld-shell-v56";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./src/systems.js",
  "./src/input.js",
  "./src/content.js",
  "./src/audio.js",
  "./src/enemy-ai.js",
  "./src/progression.js",
  "./src/combat.js",
  "./src/vfx.js",
  "./src/sprite-atlas.js",
  "./src/tile-renderer.js",
  "./src/world-art.js",
  "./src/joystick.js",
  "./assets/characters/manifest.json",
  "./assets/characters/warrior.png",
  "./assets/characters/mage.png",
  "./assets/characters/archer.png",
  "./assets/characters/slime-green.png",
  "./assets/characters/bat.png",
  "./assets/characters/wolf.png",
  "./assets/characters/skeleton.png",
  "./assets/characters/goblin.png",
  "./assets/characters/spider.png",
  "./assets/characters/imp.png",
  "./assets/characters/golem.png",
  "./assets/sprites/player.svg",
  "./assets/sprites/creatures.svg",
  "./assets/sprites/npcs.svg",
  "./data/items.json",
  "./data/recipes.json",
  "./data/skills.json",
  "./data/quests.json",
  "./data/enemies.json",
  "./data/shops.json",
  "./data/maps/forest.json",
  "./data/maps/cave.json",
  "./data/maps/village.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith("pixelworld-shell-") && key !== CACHE_VERSION).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response && response.ok && (request.mode === "navigate" || url.pathname.endsWith(".html"))) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(() => request.mode === "navigate" ? caches.match("./index.html") : new Response("", { status: 503, statusText: "Offline" }))
    })
  );
});
