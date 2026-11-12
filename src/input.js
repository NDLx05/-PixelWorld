export class InputManager {
  constructor({ onKeyDown = null } = {}) {
    this.keys = new Set();
    this.keyboardKeys = new Set();
    this.touchPointers = new Map();
    this.onKeyDown = onKeyDown;
    this.handleDown = event => {
      const key = event.key.toLowerCase();
      this.keyboardKeys.add(key);
      this.keyboardKeys.add(event.key);
      this.refreshKeys();
      this.onKeyDown?.(key, event);
    };
    this.handleUp = event => {
      this.keyboardKeys.delete(event.key.toLowerCase());
      this.keyboardKeys.delete(event.key);
      this.refreshKeys();
    };
    this.handleBlur = () => this.clear();
    this.handleVisibility = () => {
      if (document.visibilityState !== "visible") this.clear();
    };
    window.addEventListener("keydown", this.handleDown);
    window.addEventListener("keyup", this.handleUp);
    window.addEventListener("blur", this.handleBlur);
    document.addEventListener("visibilitychange", this.handleVisibility);
  }

  refreshKeys() {
    this.keys.clear();
    for (const key of this.keyboardKeys) this.keys.add(key);
    for (const key of this.touchPointers.values()) this.keys.add(key);
  }

  pressTouch(pointerId, key) {
    this.touchPointers.set(pointerId, key);
    this.refreshKeys();
  }

  releaseTouch(pointerId) {
    this.touchPointers.delete(pointerId);
    this.refreshKeys();
  }

  isDown(...keys) {
    return keys.some(key => this.keys.has(key) || this.keys.has(String(key).toLowerCase()));
  }

  clear() {
    this.keyboardKeys.clear();
    this.touchPointers.clear();
    this.keys.clear();
  }

  destroy() {
    window.removeEventListener("keydown", this.handleDown);
    window.removeEventListener("keyup", this.handleUp);
    window.removeEventListener("blur", this.handleBlur);
    document.removeEventListener("visibilitychange", this.handleVisibility);
    this.clear();
  }
}
