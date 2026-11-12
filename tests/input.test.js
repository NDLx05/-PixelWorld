import test from "node:test";
import assert from "node:assert/strict";
import { InputManager } from "../src/input.js";

function installDomMocks() {
  const makeTarget = () => {
    const listeners = new Map();
    return {
      listeners,
      addEventListener(type, handler) {
        if (!listeners.has(type)) listeners.set(type, new Set());
        listeners.get(type).add(handler);
      },
      removeEventListener(type, handler) {
        listeners.get(type)?.delete(handler);
      },
      dispatch(type, event = {}) {
        for (const handler of listeners.get(type) || []) handler(event);
      }
    };
  };
  const win = makeTarget();
  const doc = makeTarget();
  doc.visibilityState = "visible";
  globalThis.window = win;
  globalThis.document = doc;
  return { win, doc };
}

test("input state clears when the browser window loses focus", () => {
  const { win } = installDomMocks();
  const input = new InputManager();
  win.dispatch("keydown", { key: "ArrowUp" });
  assert.equal(input.isDown("ArrowUp"), true);
  win.dispatch("blur");
  assert.equal(input.isDown("ArrowUp"), false);
  input.destroy();
});

test("input state clears when the page becomes hidden", () => {
  const { win, doc } = installDomMocks();
  const input = new InputManager();
  win.dispatch("keydown", { key: "d" });
  doc.visibilityState = "hidden";
  doc.dispatch("visibilitychange");
  assert.equal(input.isDown("d"), false);
  input.destroy();
});

test("destroy removes all input listeners and clears held keys", () => {
  const { win, doc } = installDomMocks();
  const input = new InputManager();
  win.dispatch("keydown", { key: "j" });
  input.destroy();
  assert.equal(input.isDown("j"), false);
  for (const type of ["keydown", "keyup", "blur"]) {
    assert.equal(win.listeners.get(type)?.size || 0, 0);
  }
  assert.equal(doc.listeners.get("visibilitychange")?.size || 0, 0);
});


test("touch pointers are tracked independently for simultaneous controls", () => {
  installDomMocks();
  const input = new InputManager();
  input.pressTouch(1, "ArrowUp");
  input.pressTouch(2, "ArrowRight");
  assert.equal(input.isDown("ArrowUp"), true);
  assert.equal(input.isDown("ArrowRight"), true);
  input.releaseTouch(1);
  assert.equal(input.isDown("ArrowUp"), false);
  assert.equal(input.isDown("ArrowRight"), true);
  input.destroy();
});

test("releasing a touch does not cancel the same key held on keyboard", () => {
  const { win } = installDomMocks();
  const input = new InputManager();
  win.dispatch("keydown", { key: "ArrowUp" });
  input.pressTouch(9, "ArrowUp");
  input.releaseTouch(9);
  assert.equal(input.isDown("ArrowUp"), true);
  win.dispatch("keyup", { key: "ArrowUp" });
  assert.equal(input.isDown("ArrowUp"), false);
  input.destroy();
});

test("clearing input releases every active touch pointer", () => {
  installDomMocks();
  const input = new InputManager();
  input.pressTouch(1, "ArrowLeft");
  input.pressTouch(2, "ArrowDown");
  input.clear();
  assert.equal(input.isDown("ArrowLeft", "ArrowDown"), false);
  assert.equal(input.touchPointers.size, 0);
  input.destroy();
});
