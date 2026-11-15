import test from "node:test";
import assert from "node:assert/strict";
import { drawVillageLandmarks } from "../src/village-art.js";

function mockContext(){
  return {calls:0,save(){},restore(){},translate(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},arc(){},ellipse(){},stroke(){},fill(){this.calls++},fillRect(){this.calls++},set fillStyle(v){},set globalAlpha(v){},set imageSmoothingEnabled(v){}};
}
test("village landmark pass draws buildings, trees, bridge and market details",()=>{
  const ctx=mockContext();drawVillageLandmarks(ctx,0,0,1200);assert.ok(ctx.calls>100,"village scene should contain many layered pixel details");
});
test("village landmark pass supports camera offsets",()=>{
  const ctx=mockContext();drawVillageLandmarks(ctx,120,80,0);assert.ok(ctx.calls>100);
});
