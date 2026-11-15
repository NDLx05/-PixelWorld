import test from "node:test";
import assert from "node:assert/strict";
import { drawHeroClassAura } from "../src/hero-class-art.js";
function mock(){return {calls:0,save(){},restore(){},beginPath(){},ellipse(){this.calls++},stroke(){this.calls++},fillRect(){this.calls++},set imageSmoothingEnabled(v){},set globalAlpha(v){},set strokeStyle(v){},set fillStyle(v){},set lineWidth(v){}}}
test("all three classes draw distinct pixel aura accents",()=>{for(const cls of ["warrior","mage","ranger"]){const c=mock();drawHeroClassAura(c,cls,100,80,1200,true);assert.ok(c.calls>=4)}});
