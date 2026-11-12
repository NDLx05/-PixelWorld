import test from "node:test";
import assert from "node:assert/strict";
import { cameraFollow, moveWithObstacles, canUseCooldown } from "../src/systems.js";

test("camera clamps to world edges", () => {
  assert.deepEqual(cameraFollow({x:5,y:5},{width:480,height:270},{width:960,height:720}),{x:0,y:0});
  assert.deepEqual(cameraFollow({x:950,y:710},{width:480,height:270},{width:960,height:720}),{x:480,y:450});
});

test("movement respects bounds", () => {
  const hero={x:12,y:12};
  moveWithObstacles(hero,-50,-50,[],{minX:10,maxX:950,minY:10,maxY:710});
  assert.deepEqual(hero,{x:10,y:10});
});

test("movement cannot pass through solid props", () => {
  const hero={x:20,y:50};
  moveWithObstacles(hero,20,0,[{x:40,y:50,radius:10}],{minX:0,maxX:100,minY:0,maxY:100},7);
  assert.equal(hero.x,20);
});

test("cooldown readiness uses zero threshold", () => {
  assert.equal(canUseCooldown(0),true);
  assert.equal(canUseCooldown(0.1),false);
});
