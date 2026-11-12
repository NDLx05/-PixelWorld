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
    window.addEventListener("keydown", this.handleDown);
    window.addEventListener("keyup", this.handleUp);
  }

  isDown(...keys) {
    return keys.some(key => this.keys.has(key));
  }

  clear() {
    this.keys.clear();
  }

  destroy() {
    window.removeEventListener("keydown", this.handleDown);
    window.removeEventListener("keyup", this.handleUp);
    this.clear();
  }
}
