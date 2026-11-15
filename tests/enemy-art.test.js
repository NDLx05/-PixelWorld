import test from "node:test";
import assert from "node:assert/strict";
import { drawEnemyAccents } from "../src/enemy-art.js";
function mock() {
  const calls = [];
  const ctx = { calls, save(){}, restore(){}, beginPath(){}, arc(...a){calls.push(["arc",...a])}, stroke(){}, fillRect(...a){calls.push(["fillRect",...a])} };
  return ctx;
}
test("boss receives a pulsing phase ring and orbiting pixels", () => {
  const ctx = mock();
  drawEnemyAccents(ctx, {isBoss:true,hp:40,max:100,phase:2,x:2}, 20, 30, 500);
  assert.ok(ctx.calls.some(c=>c[0]==="arc"));
  assert.ok(ctx.calls.filter(c=>c[0]==="fillRect").length >= 4);
});
test("poison and slow statuses use visible pixel particles", () => {
  const poison = mock(); drawEnemyAccents(poison,{poison:2,x:0},10,10,200);
  const slow = mock(); drawEnemyAccents(slow,{slow:2,x:0},10,10,200);
  assert.equal(poison.calls.filter(c=>c[0]==="fillRect").length,3);
  assert.equal(slow.calls.filter(c=>c[0]==="fillRect").length,3);
});
test("ordinary unaffected enemies do not receive extra particles", () => {
  const ctx=mock(); drawEnemyAccents(ctx,{x:0},10,10,0);
  assert.equal(ctx.calls.length,0);
});
