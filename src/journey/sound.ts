export type Drone = {
  toggle: () => Promise<boolean>;
  setProgress: (p: number) => void;
  dispose: () => void;
};

export function createDrone(): Drone {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let oscA: OscillatorNode | null = null;
  let oscB: OscillatorNode | null = null;
  let filter: BiquadFilterNode | null = null;
  let noiseGain: GainNode | null = null;
  let running = false;
  let last = 0;

  function ensure() {
    if (ctx) return;
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0;
    filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 240;
    filter.Q.value = 0.5;
    oscA = ctx.createOscillator();
    oscB = ctx.createOscillator();
    oscA.type = "sine";
    oscB.type = "triangle";
    oscA.frequency.value = 82;
    oscB.frequency.value = 123;
    const mixB = ctx.createGain();
    mixB.gain.value = 0.22;
    oscA.connect(filter);
    oscB.connect(mixB);
    mixB.connect(filter);

    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 480;
    band.Q.value = 0.35;
    noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.012;
    noise.connect(band);
    band.connect(noiseGain);
    noiseGain.connect(master);
    filter.connect(master);
    master.connect(ctx.destination);
    noise.start();
    oscA.start();
    oscB.start();
  }

  return {
    async toggle() {
      ensure();
      if (!ctx || !master) return false;
      if (ctx.state === "suspended") await ctx.resume();
      running = !running;
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.linearRampToValueAtTime(running ? 0.11 : 0, now + 0.35);
      last = 0;
      return running;
    },
    setProgress(p: number) {
      if (!running || !ctx || !oscA || !oscB || !filter || !noiseGain) return;
      const nowMs = performance.now();
      if (nowMs - last < 90) return;
      last = nowMs;
      const hole = p > 0.9 ? (p - 0.9) * 80 : 0;
      const f = Math.max(46, 78 + Math.sin(p * Math.PI) * 36 - hole);
      const t = ctx.currentTime;
      oscA.frequency.setTargetAtTime(f, t, 0.25);
      oscB.frequency.setTargetAtTime(f * 1.5, t, 0.25);
      filter.frequency.setTargetAtTime(200 + p * 1100, t, 0.35);
      noiseGain.gain.setTargetAtTime(0.008 + (p > 0.5 ? (p - 0.5) * 0.03 : 0), t, 0.4);
    },
    dispose() {
      void ctx?.close();
      ctx = null;
      running = false;
    },
  };
}
