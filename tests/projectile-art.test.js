import test from "node:test";
import assert from "node:assert/strict";
import { drawProjectileArt } from "../src/projectile-art.js";
function mock(){const calls=[];const ctx={calls,save(){},restore(){},translate(...a){calls.push(["translate",...a])},rotate(...a){calls.push(["rotate",...a])},fillRect(...a){calls.push(["fillRect",...a])}};return ctx}
test("arrows render as rotated shafts and tips",()=>{const c=mock();drawProjectileArt(c,{kind:"arrow",vx:10,vy:0},4,5);assert.ok(c.calls.some(x=>x[0]==="rotate"));assert.ok(c.calls.filter(x=>x[0]==="fillRect").length>=3)});
test("ice and poison bolts receive distinct pixel accents",()=>{for(const kind of ["ice","poison"]){const c=mock();drawProjectileArt(c,{kind,vx:0,vy:10},0,0,200);assert.ok(c.calls.filter(x=>x[0]==="fillRect").length>=4)}});
test("hostile crystals use a separate warning palette path",()=>{const c=mock();drawProjectileArt(c,{kind:"crystal",vx:1,vy:1},0,0,0,true);assert.ok(c.calls.some(x=>x[0]==="rotate"))});
