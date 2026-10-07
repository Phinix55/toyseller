"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import RacingGame from "../../components/RacingGame";

export default function VideoGamePage() {
  const router = useRouter();
  const [screen, setScreen] = useState<'intro' | 'instructions' | 'gameplay'>('intro');

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
            className="relative w-full max-w-2xl mx-auto flex justify-center items-center p-8 md:p-16"
          >
            <img 
              src="/videogame.png" 
              alt="Vintage Video Game" 
              className="w-full h-auto object-contain drop-shadow-2xl relative z-10 pointer-events-none" 
            />
            
            {/* Transparent Interactive Screen Overlay (Sitting behind the device bezel) */}
            <div 
              className="absolute top-[10%] left-[30%] right-[30%] bottom-[62%] bg-[#8bac0f] hover:bg-[#9bbc0f] flex items-center justify-center cursor-pointer transition-all duration-300 z-0"
              onClick={() => setScreen('instructions')}
            >
              <div className="flex flex-col items-center justify-center gap-2 w-full px-4 translate-y-3">
                <p className="text-[#0f380f] font-pixel text-[8px] sm:text-[10px] text-center leading-relaxed tracking-widest opacity-80">
                  GAME &<br/>INSTRUCTIONS
                </p>
                <div className="border-2 border-[#0f380f] px-3 py-1.5 animate-pulse mt-1">
                  <p className="text-[#0f380f] font-pixel text-[8px] sm:text-[10px] text-center tracking-wider whitespace-nowrap">
                    TAP HERE
                  </p>
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
                  onClick={() => setScreen('gameplay')}
                >
                  <div className="flex flex-col items-center justify-center gap-3 -translate-x-6 -translate-y-8 lg:-translate-x-10 lg:-translate-y-14">
                    <p className="text-[#0f380f] font-pixel text-[8px] sm:text-[10px] text-center leading-relaxed tracking-widest opacity-80">
                      RACING<br/>CHAMPION
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
    </main>
  );
}
