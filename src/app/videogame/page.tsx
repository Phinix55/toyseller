"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import RacingGame from "../../components/RacingGame";

export default function VideoGamePage() {
  const router = useRouter();
  const [screen, setScreen] = useState<'intro' | 'instructions' | 'gameplay'>('intro');
  const [activeSheet, setActiveSheet] = useState<'about' | 'story' | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on mount (matches RacingGame.tsx logic exactly)
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext && !audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }

    // Hard kill any lingering background music from the intro scene
    const bgm = (window as any).heroBgm;
    if (bgm) {
      bgm.pause();
      bgm.currentTime = 0;
    }
    // Flag so if user hits back button, the hero music doesn't blast again
    (window as any)._hasPlayedIntro = true;
  }, []);

  const playTapSound = () => {
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
  };

  return (
    <main className="relative min-h-screen w-full bg-white overflow-hidden flex items-center justify-center">
      {/* Back Button */}
      <button
        onClick={() => {
          if (screen === 'gameplay') setScreen('instructions');
          else if (screen === 'instructions') setScreen('intro');
          else router.push('/');
        }}
        className="absolute top-8 left-8 text-black/60 hover:text-black transition-colors font-medium text-sm flex items-center gap-2 z-50"
      >
        <span>←</span> {screen === 'instructions' ? "Back to Gameboy" : "Back to Story"}
      </button>

      <AnimatePresence mode="wait">
        {screen === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full flex justify-center items-center pointer-events-none"
          >
            {/* Left Side: About Toy (Desktop Only) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:block absolute bottom-12 left-8 md:bottom-20 md:left-16 max-w-[420px] space-y-8 z-20 pointer-events-auto"
            >
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black uppercase">
                About Toy
              </h2>
              <ul className="space-y-4 text-lg md:text-xl font-medium text-black/60 leading-relaxed">
                <li className="flex items-center gap-3">
                  <span className="text-black text-2xl">🎮</span> 8-in-1 Classic Games
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-black text-2xl">🏁</span> Retro Racing & Block Puzzles
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-black text-2xl">🔋</span> Powered by 2x AA Batteries
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-black text-2xl">🕹️</span> Pure Monochrome LCD Magic
                </li>
              </ul>
              <div className="pt-4">
                <kbd className="px-8 h-14 flex items-center justify-center bg-white border-4 border-black rounded-xl shadow-[0_6px_0_#1a1a1a] text-black font-black text-lg uppercase tracking-widest hover:translate-y-1 hover:shadow-[0_2px_0_#1a1a1a] transition-all cursor-default">
                  PRICE: ₹90
                </kbd>
              </div>
            </motion.div>

            {/* Right Side: The Story (Desktop Only) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:flex absolute top-12 right-8 md:top-20 md:right-16 max-w-[380px] space-y-5 z-20 pointer-events-auto flex-col items-end"
            >
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black uppercase">
                The Story
              </h2>
              <div className="space-y-4 text-right">
                <p className="text-lg md:text-xl font-medium text-black/60 leading-relaxed">
                  I still remember buying this exact console right outside my school from the <span className="text-black font-bold italic">Khilone wale bhaiya</span> back in 2012.
                </p>
                <p className="text-lg md:text-xl font-medium text-black/60 leading-relaxed">
                  It became my absolute favorite thing to play during the summer holidays. Back then, we didn't have the internet or mobile games, just pure, simple fun.
                </p>
              </div>
            </motion.div>

            {/* Mobile Bottom Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="md:hidden absolute bottom-6 left-0 right-0 px-4 z-20 pointer-events-auto flex gap-3"
            >
              <button 
                onClick={() => setActiveSheet('about')}
                className="flex-1 bg-black text-white font-black py-3.5 rounded-xl shadow-xl uppercase tracking-wider text-xs border-2 border-black active:scale-95 transition-transform"
              >
                About Toy
              </button>
              <button 
                onClick={() => setActiveSheet('story')}
                className="flex-1 bg-white text-black font-black py-3.5 rounded-xl shadow-xl uppercase tracking-wider text-xs border-2 border-black active:scale-95 transition-transform"
              >
                The Story
              </button>
            </motion.div>

            {/* Centered Gameboy */}
            <div className="relative w-full max-w-2xl mx-auto flex justify-center items-center p-8 md:p-16 pointer-events-auto">
              <img
                src="/videogame.png"
                alt="Vintage Video Game"
                className="w-full h-auto max-h-[70vh] md:max-h-none object-contain drop-shadow-2xl relative z-10 pointer-events-none"
              />

              {/* Transparent Interactive Screen Overlay (Sitting behind the device bezel) */}
              <div
                className="absolute top-[10%] left-[30%] right-[30%] bottom-[62%] bg-[#8bac0f] hover:bg-[#9bbc0f] flex items-center justify-center cursor-pointer transition-all duration-300 z-0"
                onClick={() => {
                  playTapSound();
                  setScreen('instructions');
                }}
              >
                <div className="flex flex-col items-center justify-center gap-2 w-full px-4 translate-y-3">
                  <p className="text-[#0f380f] font-pixel text-[8px] sm:text-[10px] text-center leading-relaxed tracking-widest opacity-80">
                    GAME &<br />INSTRUCTIONS
                  </p>
                  <div className="border-2 border-[#0f380f] px-3 py-1.5 animate-pulse mt-1">
                    <p className="text-[#0f380f] font-pixel text-[8px] sm:text-[10px] text-center tracking-wider whitespace-nowrap">
                      TAP HERE
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {screen === 'instructions' && (
          <motion.div
            key="instructions"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="absolute inset-0 flex w-full h-full"
          >
            {/* Left Side: Game Instructions (Minimalist Bottom-Left) */}
            <div className="w-full lg:w-[40%] h-full flex flex-col justify-end pb-16 px-8 lg:px-20 xl:px-24 bg-transparent relative z-10">
              <div className="space-y-6 max-w-sm">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-black mb-1">
                    INSTRUCTIONS
                  </h1>
                  <h2 className="text-xl font-bold tracking-tight text-black/50">
                    CONTROLS
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <kbd className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black rounded-lg shadow-[0_4px_0_#1a1a1a] text-black font-black text-lg">←</kbd>
                      <kbd className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black rounded-lg shadow-[0_4px_0_#1a1a1a] text-black font-black text-lg">→</kbd>
                    </div>
                    <span className="text-black/80 font-bold tracking-wide text-sm">STEER</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <kbd className="w-22 px-4 h-10 flex items-center justify-center bg-white border-2 border-black rounded-lg shadow-[0_4px_0_#1a1a1a] text-black font-black text-xs uppercase tracking-widest">SPACE</kbd>
                    <span className="text-black/80 font-bold tracking-wide text-sm">SHOOT TARGET (💀)</span>
                  </div>
                </div>

                <p className="text-red-500/80 font-bold text-xs uppercase tracking-wider pt-2">
                  * SPEED INCREASES WITH SCORE
                </p>
              </div>
            </div>

            {/* Right Side: Visual */}
            <div className="hidden lg:flex w-[60%] h-full items-center justify-end relative z-0">
              <div className="relative h-full aspect-[3/2] shrink-0">
                {/* Tilted Digital Screen Overlay (Sitting behind the device bezel) */}
                <div
                  className="absolute top-[11%] left-[23%] w-[28%] h-[38%] bg-[#8bac0f] hover:bg-[#9bbc0f] flex items-center justify-center cursor-pointer -rotate-[13deg] transition-colors z-0"
                  onClick={() => {
                    playTapSound();
                    setScreen('gameplay');
                  }}
                >
                  <div className="flex flex-col items-center justify-center gap-3 -translate-x-6 -translate-y-8 lg:-translate-x-10 lg:-translate-y-14">
                    <p className="text-[#0f380f] font-pixel text-[8px] sm:text-[10px] text-center leading-relaxed tracking-widest opacity-80">
                      RACING<br />CHAMPION
                    </p>
                    <div className="border-2 border-[#0f380f] px-2 py-1.5 animate-pulse mt-1">
                      <p className="text-[#0f380f] font-pixel text-[8px] sm:text-[10px] text-center tracking-wider whitespace-nowrap">
                        TAP TO PLAY
                      </p>
                    </div>
                  </div>
                </div>

                <img
                  src="/bg6.png"
                  alt="Gameplay Preview"
                  className="w-full h-full object-cover drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)] pointer-events-none relative z-10"
                />
              </div>
            </div>
          </motion.div>
        )}

        {screen === 'gameplay' && (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -50 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center w-full h-full bg-white z-40"
          >
            {/* The Straight-On Gameplay Device Container */}
            <div className="relative h-screen w-auto max-w-none aspect-[3/2] flex items-center justify-center">
              <img
                src="/gameplay.png"
                alt="Game Console"
                className="w-full h-full object-cover pointer-events-none relative z-10"
              />

              {/* The Actual Game Canvas Mask */}
              {/* Using generous bleed percentages to hide perfectly behind the opaque red plastic */}
              <div
                className="absolute top-[18%] left-[30%] w-[39.5%] h-[75%] z-0 overflow-hidden"
              >
                <RacingGame />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Mobile Bottom Sheet Overlay */}
      <AnimatePresence>
        {activeSheet && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSheet(null)}
              className="fixed inset-0 bg-black/60 z-[100] md:hidden backdrop-blur-sm"
            />
            
            {/* Bottom Sheet */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[101] md:hidden p-8 pb-12 shadow-2xl overflow-y-auto max-h-[85vh] pointer-events-auto"
            >
              {/* Drag Handle */}
              <div className="w-12 h-1.5 bg-black/20 rounded-full mx-auto mb-8" />
              
              {activeSheet === 'about' ? (
                <div className="space-y-8">
                  <h2 className="text-3xl font-black tracking-tighter text-black uppercase">
                    About Toy
                  </h2>
                  <ul className="space-y-4 text-lg font-medium text-black/60 leading-relaxed">
                    <li className="flex items-center gap-3">
                      <span className="text-black text-2xl">🎮</span> 8-in-1 Classic Games
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-black text-2xl">🏁</span> Retro Racing & Block Puzzles
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-black text-2xl">🔋</span> Powered by 2x AA Batteries
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-black text-2xl">🕹️</span> Pure Monochrome LCD Magic
                    </li>
                  </ul>
                  <div className="pt-4">
                    <kbd className="w-full h-14 flex items-center justify-center bg-white border-4 border-black rounded-xl shadow-[0_6px_0_#1a1a1a] text-black font-black text-lg uppercase tracking-widest cursor-default">
                      PRICE: ₹90
                    </kbd>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black tracking-tighter text-black uppercase">
                    The Story
                  </h2>
                  <div className="space-y-4">
                    <p className="text-lg font-medium text-black/60 leading-relaxed">
                      I still remember buying this exact console right outside my school from the <span className="text-black font-bold italic">Khilone wale bhaiya</span> back in 2012.
                    </p>
                    <p className="text-lg font-medium text-black/60 leading-relaxed">
                      It became my absolute favorite thing to play during the summer holidays. Back then, we didn't have the internet or mobile games, just pure, simple fun.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
