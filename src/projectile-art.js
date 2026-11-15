// Pixel-native projectile rendering with class-specific silhouettes and trails.
export function drawProjectileArt(ctx, projectile, x, y, time = 0, hostile = false) {
  if (!ctx || !projectile) return;
  const angle = Math.atan2(projectile.vy || 0, projectile.vx || 1);
  const kind = projectile.kind || (hostile ? "crystal" : "bolt");
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  if (hostile || kind === "crystal") {
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = "#ef766a";
    ctx.fillRect(Math.round(x - Math.cos(angle) * 8 - 3), Math.round(y - Math.sin(angle) * 8 - 3), 7, 7);
    ctx.globalAlpha = 1;
    ctx.translate(Math.round(x), Math.round(y));
    ctx.rotate(angle);
    ctx.fillStyle = "#ff8c79";
    ctx.fillRect(-5, -2, 10, 4);
    ctx.fillStyle = "#fff0c5";
    ctx.fillRect(-2, -1, 4, 2);
  } else if (kind === "arrow") {
    ctx.translate(Math.round(x), Math.round(y));
    ctx.rotate(angle);
    ctx.fillStyle = "#a97842";
    ctx.fillRect(-8, -1, 13, 2);
    ctx.fillStyle = "#e9e4d2";
    ctx.fillRect(5, -2, 4, 4);
    ctx.fillStyle = "#75cfff";
    ctx.fillRect(-9, -2, 3, 1);
    ctx.fillRect(-9, 1, 3, 1);
  } else {
    const color = kind === "ice" ? "#8be4ff" : kind === "poison" ? "#a5df6b" : "#ffd47b";
    ctx.globalAlpha = 0.24;
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x - Math.cos(angle) * 8 - 3), Math.round(y - Math.sin(angle) * 8 - 3), 7, 7);
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x - 3), Math.round(y - 3), 6, 6);
    ctx.fillStyle = "#fff";
    ctx.fillRect(Math.round(x - 1), Math.round(y - 1), 2, 2);
    if (kind === "ice") {
      ctx.fillStyle = "#d9fbff";
      ctx.fillRect(Math.round(x - 1), Math.round(y - 5), 2, 10);
      ctx.fillRect(Math.round(x - 5), Math.round(y - 1), 10, 2);
    } else if (kind === "poison") {
      ctx.fillStyle = "#d8ff9a";
      ctx.fillRect(Math.round(x + Math.sin(time / 90) * 4), Math.round(y - 5), 2, 2);
    }
  }
  ctx.restore();
}
