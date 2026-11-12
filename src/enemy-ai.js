/** Small, deterministic enemy state machine shared by all world encounters. */
export function updateEnemyAI(enemy, target, dt = 0, definition = {}) {
  if (!enemy || !target) return { state: "idle", distance: Infinity, moveX: 0, moveY: 0 };
  const dx = Number(target.x) - Number(enemy.x);
  const dy = Number(target.y) - Number(enemy.y);
  const distance = Math.hypot(dx, dy);
  const maxHp = Math.max(1, Number(enemy.max) || Number(enemy.hp) || 1);
  const hpRatio = Math.max(0, Number(enemy.hp) || 0) / maxHp;
  const retreatAt = Number.isFinite(definition.retreatAt) ? definition.retreatAt : 0.2;
  const retreatDistance = Number.isFinite(definition.retreatDistance) ? definition.retreatDistance : 70;
  const attackRange = Number.isFinite(definition.attackRange) ? definition.attackRange : (enemy.isBoss ? 22 : 17);
  const aggroRange = Number.isFinite(definition.aggroRange) ? definition.aggroRange : (enemy.isBoss ? 220 : 125);

  let state = "idle";
  if (enemy.hp <= 0) state = "dead";
  else if (!enemy.isBoss && hpRatio <= retreatAt && distance < retreatDistance) state = "retreat";
  else if (distance <= attackRange) state = "attack";
  else if (distance <= aggroRange) state = "chase";

  if (enemy.state !== state) {
    enemy.state = state;
    enemy.stateTime = 0;
  } else {
    enemy.stateTime = Math.max(0, Number(enemy.stateTime) || 0) + Math.max(0, Number(dt) || 0);
  }

  if (state !== "chase" && state !== "retreat") {
    return { state, distance, moveX: 0, moveY: 0 };
  }
  const length = distance || 1;
  const direction = state === "retreat" ? -1 : 1;
  const baseSpeed = Number(definition.speed) || 27;
  const speed = (enemy.slow > 0 ? 12 : baseSpeed) * (state === "retreat" ? 0.8 : 1) * (enemy.phase === 2 ? 1.2 : 1);
  return {
    state,
    distance,
    moveX: dx / length * speed * direction,
    moveY: dy / length * speed * direction
  };
}
