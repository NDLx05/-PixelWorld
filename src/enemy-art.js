// Lightweight pixel accents for elite enemies and status effects.
export function drawEnemyAccents(ctx, enemy, x, y, time = 0) {
  if (!enemy || !ctx) return;
  const pulse = 0.5 + Math.sin(time / 180 + (enemy.x || 0) * 0.03) * 0.5;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  if (enemy.isBoss) {
    const phase = enemy.phase || (enemy.hp / Math.max(1, enemy.max) < 0.5 ? 2 : 1);
    ctx.globalAlpha = 0.22 + pulse * 0.2;
    ctx.strokeStyle = phase === 2 ? "#ff8b72" : "#82eaff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(Math.round(x), Math.round(y), 24 + pulse * 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = phase === 2 ? "#ffb27d" : "#9cecff";
    for (let i = 0; i < 4; i++) {
      const a = time / 500 + i * Math.PI / 2;
      ctx.fillRect(Math.round(x + Math.cos(a) * 29), Math.round(y + Math.sin(a) * 19), 3, 3);
    }
  }
  if (enemy.poison > 0 || enemy.slow > 0 || (enemy.hit || 0) > 0) {
    const color = enemy.poison > 0 ? "#a5df6b" : enemy.slow > 0 ? "#8be4ff" : "#fff0c2";
    ctx.globalAlpha = enemy.hit > 0 ? 0.9 : 0.55 + pulse * 0.2;
    ctx.fillStyle = color;
    const count = enemy.isBoss ? 7 : 3;
    for (let i = 0; i < count; i++) {
      const a = time / 420 + i * Math.PI * 2 / count;
      const r = (enemy.isBoss ? 25 : 14) + Math.sin(time / 130 + i) * 2;
      ctx.fillRect(Math.round(x + Math.cos(a) * r), Math.round(y - 7 + Math.sin(a) * r * 0.55), 2, 2);
    }
  }
  ctx.restore();
}
