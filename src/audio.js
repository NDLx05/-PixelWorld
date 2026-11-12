export class AudioEngine {
  constructor() {
    this.context = null;
    this.enabled = true;
    this.master = null;
  }

  unlock() {
    if (!this.enabled) return;
    const Ctx = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Ctx) return;
    if (!this.context) {
      this.context = new Ctx();
      this.master = this.context.createGain();
      this.master.gain.value = 0.16;
      this.master.connect(this.context.destination);
    }
    if (this.context.state === "suspended") this.context.resume().catch(() => {});
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.master) this.master.gain.value = this.enabled ? 0.16 : 0;
    return this.enabled;
  }

  play(name) {
    if (!this.enabled || !this.context || this.context.state !== "running") return;
    const patterns = {
      hit: [[150, 0.07, "square"], [90, 0.06, "triangle"]],
      gather: [[540, 0.07, "sine"], [760, 0.09, "sine"]],
      quest: [[440, 0.1, "sine"], [660, 0.12, "sine"], [880, 0.16, "sine"]],
      level: [[520, 0.1, "triangle"], [660, 0.1, "triangle"], [880, 0.2, "triangle"]],
      skill: [[300, 0.08, "square"], [460, 0.12, "triangle"]],
      potion: [[420, 0.08, "sine"], [620, 0.14, "sine"]],
      hurt: [[110, 0.12, "sawtooth"]]
    };
    const notes = patterns[name] || patterns.skill;
    let offset = 0;
    for (const [frequency, duration, type] of notes) {
      const start = this.context.currentTime + offset;
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.55, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(start);
      osc.stop(start + duration + 0.015);
      offset += duration * 0.72;
    }
  }
}
