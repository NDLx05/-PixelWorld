export function calculateIncomingDamage(baseDamage, armor = 0, guardedReduction = 0) {
  const base = Number.isFinite(Number(baseDamage)) ? Number(baseDamage) : 1;
  const defense = Number.isFinite(Number(armor)) ? Number(armor) : 0;
  const reduction = Number.isFinite(Number(guardedReduction)) ? Number(guardedReduction) : 0;
  return Math.max(1, base - Math.max(0, defense) * 2 - Math.max(0, reduction));
}

export function applyLevelUps(hero, classDef, maxLevel = 999) {
  if (!hero || !classDef) return 0;
  const cap = Math.max(1, Math.floor(Number(maxLevel) || 999));
  let gained = 0;
  while (hero.lv < cap && hero.xp >= hero.lv * 45) {
    hero.xp -= hero.lv * 45;
    hero.lv++;
    hero.hp = Math.min(classDef.hp, hero.hp + 25);
    hero.mp = Math.min(classDef.mp, hero.mp + 20);
    gained++;
  }
  return gained;
}
