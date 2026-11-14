import test from "node:test";
import assert from "node:assert/strict";
import { drawResourceNode, drawWorldAtmosphere } from "../src/world-art.js";

function mockContext(){
 const gradient={addColorStop(){}};
 return {calls:0,save(){},restore(){},beginPath(){},ellipse(){},fill(){this.calls++},stroke(){},moveTo(){},lineTo(){},closePath(){},fillRect(){this.calls++},createRadialGradient(){return gradient},set fillStyle(v){},set strokeStyle(v){},set lineWidth(v){},set globalAlpha(v){},set imageSmoothingEnabled(v){}};
}
test("resource props render for tree, rock, ore and crystal",()=>{
 for(const type of ["tree","rock","ore","crystal"]){const ctx=mockContext();drawResourceNode(ctx,type,40,50,"forest",123);assert.ok(ctx.calls>3,type+" should draw layered details");}
});
test("world atmosphere renders deterministic layers without random",()=>{
 const ctx=mockContext();drawWorldAtmosphere(ctx,"forest",480,270,1000);assert.ok(ctx.calls>=10);
});
