let ctx: AudioContext | null = null;
let hooked = false;

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  if (!hooked && typeof document !== "undefined") {
    hooked = true;
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && ctx?.state === "suspended") {
        void ctx.resume();
      }
    });
  }
  return ctx;
}

export function unlockAudio() {
  const audio = getCtx();
  if (audio.state === "suspended") void audio.resume();
}

export function playTone(kind: "ok" | "no" | "star", muted: boolean) {
  if (muted) return;
  const audio = getCtx();
  if (audio.state === "suspended") void audio.resume();
  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.connect(gain);
  gain.connect(audio.destination);
  gain.gain.setValueAtTime(0.0001, now);
  if (kind === "ok") {
    osc.type = "triangle";
    osc.frequency.setValueAtTime(523, now);
    osc.frequency.linearRampToValueAtTime(784, now + 0.09);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.start(now);
    osc.stop(now + 0.2);
  } else if (kind === "no") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(160, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.22);
  } else {
    osc.type = "triangle";
    osc.frequency.setValueAtTime(523, now);
    osc.frequency.setValueAtTime(659, now + 0.08);
    osc.frequency.setValueAtTime(880, now + 0.16);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);
    osc.start(now);
    osc.stop(now + 0.38);
  }
}
