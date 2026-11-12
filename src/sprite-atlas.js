export const HERO_SPRITES = Object.freeze({ warrior: "warrior", mage: "mage", ranger: "archer" });
export const ENEMY_SPRITES = Object.freeze({
  slime: "slime-green", bat: "bat", wolf: "wolf", skeleton: "skeleton",
  goblin: "goblin", spider: "spider", imp: "imp", guardian: "golem",
  crystal_guardian: "golem", fire_slime: "slime-green"
});

export function animationState({ dead = false, hurt = false, attacking = false, moving = false } = {}) {
  if (dead) return "die";
  if (hurt) return "hurt";
  if (attacking) return "attack";
  if (moving) return "walk";
  return "idle";
}

export function animationFrame(timeMs, fps, frames) {
  if (!frames || frames < 1) return 0;
  return Math.floor(Math.max(0, timeMs) * fps / 1000) % frames;
}

export class SpriteAtlas {
  constructor(manifestUrl = "./assets/characters/manifest.json") {
    this.manifestUrl = manifestUrl;
    this.manifest = null;
    this.images = new Map();
    this.ready = this.load();
  }

  async load() {
    try {
      const response = await fetch(this.manifestUrl);
      if (!response.ok) throw new Error("Không tải được manifest nhân vật");
      this.manifest = await response.json();
      await Promise.all(Object.entries(this.manifest).map(([key, spec]) => new Promise(resolve => {
        const image = new Image();
        image.onload = () => { this.images.set(key, image); resolve(); };
        image.onerror = () => resolve();
        image.src = "./" + spec.src.replace(/^\.\//, "");
      })));
      return this;
    } catch (error) {
      console.warn("[PixelWorld] Sprite atlas fallback:", error);
      return this;
    }
  }

  draw(ctx, key, state, timeMs, x, y, width, height) {
    const spec = this.manifest?.[key];
    const image = this.images.get(key);
    if (!spec || !image) return false;
    const animation = spec.rows?.[state] || spec.rows?.idle;
    if (!animation) return false;
    const frame = animationFrame(timeMs, animation.fps || 10, animation.frames || 1);
    const sx = (frame % spec.columns) * spec.frameWidth;
    const sy = animation.row * spec.frameHeight;
    if (sx + spec.frameWidth > image.width || sy + spec.frameHeight > image.height) return false;
    ctx.drawImage(image, sx, sy, spec.frameWidth, spec.frameHeight, x - width / 2, y - height * 0.78, width, height);
    return true;
  }
}
