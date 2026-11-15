import test from "node:test";
import assert from "node:assert/strict";
import { drawBiomeLandmarks } from "../src/biome-art.js";
function mock(){return {calls:0,save(){},restore(){},fillRect(){this.calls++},set fillStyle(v){},set globalAlpha(v){},set imageSmoothingEnabled(v){}}}
test("forest landmarks draw trees, fallen log, mushrooms and fireflies",()=>{const c=mock();drawBiomeLandmarks(c,"forest",0,0,500);assert.ok(c.calls>35)});
test("cave landmarks draw rock formations and glowing crystals",()=>{const c=mock();drawBiomeLandmarks(c,"cave",100,40,800);assert.ok(c.calls>30)});
test("biome landmarks ignore unrelated worlds",()=>{const c=mock();drawBiomeLandmarks(c,"village",0,0,0);assert.equal(c.calls,0)});
