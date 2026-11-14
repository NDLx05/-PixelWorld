import test from "node:test";
import assert from "node:assert/strict";
import { joystickDirections, joystickPointerKey } from "../src/joystick.js";

test("virtual joystick maps all eight directions", () => {
  const cases = [
    [0,-30,["up"]],[0,30,["down"]],[-30,0,["left"]],[30,0,["right"]],
    [-30,-30,["up","left"]],[30,-30,["up","right"]],
    [-30,30,["down","left"]],[30,30,["down","right"]]
  ];
  for (const [x,y,expected] of cases) {
    assert.deepEqual(joystickDirections(x,y,40).map(d=>d.name),expected);
  }
});

test("joystick has a dead zone and clamps far drags", () => {
  assert.deepEqual(joystickDirections(2,2,40),[]);
  assert.deepEqual(joystickDirections(400,0,40).map(d=>d.key),["ArrowRight"]);
});

test("simultaneous joystick pointers receive independent source keys", () => {
  assert.notEqual(joystickPointerKey(1,"left"),joystickPointerKey(2,"left"));
  assert.equal(joystickPointerKey(7,"up"),"joystick:7:up");
});
