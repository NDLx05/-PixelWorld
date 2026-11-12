/**
 * PixelWorld pixel VFX.
 * Small, deterministic, canvas-native effects inspired by the Pixelfx workflow:
 * anticipation, a bright contact frame, varied sparks, and a clean decay.
 */
export class PixelVFX {
  constructor({ maxParticles = 240, seed = 0x51f15e } = {}) {
    this.maxParticles = maxParticles;
    this.seed = seed >>> 0;
    this.sequence = 0;
    this.particles = [];
    this.effects = [];
  }

  random() {
    this.seed = (Math.imul(this.seed, 1664525) + 1013904223) >>> 0;
    return this.seed / 4294967296;
  }

  particle(x, y, color, options = {}) {
    const angle = options.angle ?? this.random() * Math.PI * 2;
    const speed = options.speed ?? 24 + this.random() * 74;
    const life = options.life ?? 0.22 + this.random() * 0.28;
    this.particles.push({
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      color, life, maxLife: life, size: options.size ?? (this.random() < 0.25 ? 2 : 1),
      gravity: options.gravity ?? 32, drag: options.drag ?? 0.94
    });
    if (this.particles.length > this.maxParticles) this.particles.splice(0, this.particles.length - this.maxParticles);
  }

  burst(x, y, colors, count = 10, options = {}) {
    for (let i = 0; i < count; i++) {
      const color = colors[i % colors.length];
      this.particle(x, y, color, {
        angle: (Math.PI * 2 * i / count) + (this.random() - 0.5) * 0.45,
        speed: (options.speed ?? 62) * (0.45 + this.random() * 0.8),
        life: (options.life ?? 0.34) * (0.7 + this.random() * 0.65),
        size: this.random() < 0.2 ? 2 : 1,
        gravity: options.gravity ?? 38,
        drag: options.drag ?? 0.94
      });
    }
  }

  slash(x, y, facing = { x: 1, y: 0 }, style = "sword") {
    const angle = Math.atan2(facing.y || 0, facing.x || 1);
    this.effects.push({ type: "slash", x, y: y - 8, angle, style, t: 0, duration: 0.24 });
    const palette = style === "magic" ? ["#9cecff", "#54a9ff", "#f4fbff"] : ["#f4d77b", "#e9a64d", "#fff6c7"];
    this.burst(x + facing.x * 12, y - 9 + facing.y * 12, palette, 7, { speed: 44, life: 0.2, gravity: 8 });
  }

  impact(x, y, color = "#ffe5a1") {
    this.effects.push({ type: "impact", x, y, t: 0, duration: 0.2 });
    this.burst(x, y, [color, "#fff8d9", "#d9f2ff"], 9, { speed: 56, life: 0.25, gravity: 50 });
  }

  cast(x, y, color = "#8ddfff") {
    this.effects.push({ type: "cast", x, y: y - 7, t: 0, duration: 0.42, color });
    this.burst(x, y - 7, [color, "#e9faff", "#7b8cff"], 8, { speed: 30, life: 0.42, gravity: -12 });
  }

  heal(x, y) {
    this.effects.push({ type: "heal", x, y, t: 0, duration: 0.62 });
    this.burst(x, y - 5, ["#8df0a2", "#e4ffd9", "#57c98b"], 15, { speed: 42, life: 0.55, gravity: -18 });
  }

  levelUp(x, y) {
    this.effects.push({ type: "level", x, y, t: 0, duration: 0.9 });
    this.burst(x, y - 12, ["#fff1a1", "#ffc94f", "#fff9df", "#8ce7ff"], 26, { speed: 72, life: 0.72, gravity: -26 });
  }

  pickup(x, y) {
    this.effects.push({ type: "pickup", x, y, t: 0, duration: 0.36 });
    this.burst(x, y - 5, ["#f9e38b", "#fff8d9"], 6, { speed: 22, life: 0.3, gravity: -10 });
  }

  update(dt) {
    const step = Math.max(0, Number(dt) || 0);
    for (const p of this.particles) {
      p.life -= step;
      p.vx *= Math.pow(p.drag, step * 60);
      p.vy = p.vy * Math.pow(p.drag, step * 60) + p.gravity * step;
      p.x += p.vx * step;
      p.y += p.vy * step;
    }
    this.particles = this.particles.filter(p => p.life > 0);
    for (const fx of this.effects) fx.t += step;
    this.effects = this.effects.filter(fx => fx.t < fx.duration);
  }

  draw(ctx, camera = { x: 0, y: 0 }) {
    const cx = camera.x || 0, cy = camera.y || 0;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    for (const fx of this.effects) {
      const progress = Math.min(1, fx.t / fx.duration);
      const x = Math.round(fx.x - cx), y = Math.round(fx.y - cy);
      if (fx.type === "slash") {
        const fade = 1 - progress;
        const start = fx.angle - 0.95 + progress * 0.3;
        const end = fx.angle + 0.95 + progress * 0.3;
        ctx.globalAlpha = fade;
        for (let i = 0; i < 13; i++) {
          const a = start + (end - start) * i / 12;
          const r = 12 + Math.sin(Math.PI * i / 12) * 9;
          const px = Math.round(x + Math.cos(a) * r), py = Math.round(y + Math.sin(a) * r);
          ctx.fillStyle = i % 3 === 0 ? "#fff9d7" : fx.style === "magic" ? "#74d9ff" : "#f2c56b";
          ctx.fillRect(px, py, 2, 2);
        }
      } else if (fx.type === "impact") {
        ctx.globalAlpha = 1 - progress;
        const radius = 2 + progress * 8;
        ctx.fillStyle = "#fff5c4";
        for (let i = 0; i < 8; i++) {
          const a = i * Math.PI / 4;
          ctx.fillRect(Math.round(x + Math.cos(a) * radius), Math.round(y + Math.sin(a) * radius), 2, 2);
        }
        ctx.fillRect(x - 1, y - 1, 3, 3);
      } else {
        ctx.globalAlpha = 1 - progress;
        const radius = fx.type === "level" ? 8 + progress * 22 : 5 + progress * 12;
        ctx.strokeStyle = fx.type === "heal" ? "#8df0a2" : fx.type === "level" ? "#ffe58a" : fx.type === "pickup" ? "#ffe58a" : fx.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(x, y, radius, radius * 0.48, 0, 0, Math.PI * 2);
        ctx.stroke();
        if (fx.type === "level") {
          ctx.fillStyle = "#fff1a1";
          ctx.font = "bold 8px monospace";
          ctx.textAlign = "center";
          ctx.fillText("LEVEL UP!", x, y - 17 - progress * 8);
        }
      }
    }
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x - cx), Math.round(p.y - cy), p.size, p.size);
    }
    ctx.restore();
  }

  clear() {
    this.particles.length = 0;
    this.effects.length = 0;
  }
}
