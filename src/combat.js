export function findMeleeTarget(hero, enemies, facing, range = 42, halfWidth = 23) {
  return enemies
    .filter(enemy => {
      const dx = enemy.x - hero.x;
      const dy = enemy.y - hero.y;
      const forward = dx * facing.x + dy * facing.y;
      const side = Math.abs(dx * facing.y - dy * facing.x);
      return Math.hypot(dx, dy) < range && forward >= 0 && side < halfWidth;
    })
    .sort((a, b) =>
      Math.hypot(hero.x - a.x, hero.y - a.y) -
      Math.hypot(hero.x - b.x, hero.y - b.y)
    )[0] || null;
}

export function createProjectile(origin, target, facing, speed, damage, kind) {
  const dx = target ? target.x - origin.x : facing.x;
  const dy = target ? target.y - origin.y : facing.y;
  const length = Math.hypot(dx, dy) || 1;
  return {
    x: origin.x,
    y: origin.y,
    vx: dx / length * speed,
    vy: dy / length * speed,
    damage,
    kind,
    ttl: 2
  };
}
