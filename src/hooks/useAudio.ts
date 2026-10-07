import { useEffect, useRef, useCallback } from "react";

export function useAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext && !audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
  }, []);

  const playTapSound = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("Tap sound blocked", e);
    }
  }, []);

  return { playTapSound };
}
