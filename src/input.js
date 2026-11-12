export class InputManager {
  constructor({ onKeyDown = null } = {}) {
    this.keys = new Set();
    this.onKeyDown = onKeyDown;
    this.handleDown = event => {
      const key = event.key.toLowerCase();
      this.keys.add(key);
      this.keys.add(event.key);
      this.onKeyDown?.(key, event);
    };
    this.handleUp = event => {
      this.keys.delete(event.key.toLowerCase());
      this.keys.delete(event.key);
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

  isDown(...keys) {
    return keys.some(key => this.keys.has(key) || this.keys.has(String(key).toLowerCase()));
  }

  clear() {
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
