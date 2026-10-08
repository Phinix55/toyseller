"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import RacingGame from "../../components/RacingGame";
import { useAudio } from "../../hooks/useAudio";
import { GameIntroContent } from "../../components/game/GameIntro";
import { GameInstructionsContent } from "../../components/game/GameInstructions";
import { GameMobileSheet } from "../../components/game/GameMobileSheet";

export default function VideoGamePage() {
  const router = useRouter();
  const [screen, setScreen] = useState<'intro' | 'instructions' | 'gameplay'>('intro');
  const [activeSheet, setActiveSheet] = useState<'about' | 'story' | 'instructions' | null>(null);
  const { playTapSound } = useAudio();

  useEffect(() => {
    // Hard kill any lingering background music from the intro scene
    const bgm = (window as any).heroBgm;
    if (bgm) {
      bgm.pause();
      bgm.currentTime = 0;
    }
    // Flag so if user hits back button, the hero music doesn't blast again
    (window as any)._hasPlayedIntro = true;
  }, []);

  // Background Cache Preloader
  useEffect(() => {
    if (screen === 'intro') {
      const timer = setTimeout(() => {
        // Silently pull all downstream heavy images into the browser cache
        const imagesToPreload = [
          "/assets/desktop/bg6.avif",
          "/assets/mobile/mobbg6.avif",
          "/assets/desktop/gameplay.avif",
          "/assets/mobile/mobgameplay.avif"
        ];
        imagesToPreload.forEach(src => {
          const img = new Image();
          img.src = src;
        });
      }, 1000); // Wait 1 second for entry animations to finish before using network

      return () => clearTimeout(timer);
    }
  }, [screen]);

  return (
    <main className="relative min-h-[100dvh] w-full bg-white overflow-hidden flex items-center justify-center">
      {/* Back Button */}
      <button
        onClick={() => {
          if (screen === 'gameplay') setScreen('instructions');
          else if (screen === 'instructions') setScreen('intro');
          else router.push('/');
        }}
        className={`absolute top-8 left-8 bg-black text-white px-4 py-2 rounded-xl font-medium text-sm items-center gap-2 z-50 shadow-xl border-2 border-black hover:scale-105 active:scale-95 transition-all ${screen === 'gameplay' ? 'hidden md:flex' : 'flex'}`}
      >
        <span>←</span> {
          screen === 'gameplay' ? "Exit Game" : 
          screen === 'instructions' ? "Back to Toy" : 
          "Back to Story"
        }
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
            <GameIntroContent 
              setActiveSheet={setActiveSheet} 
              onPlay={() => { playTapSound(); setScreen('instructions'); }} 
            />
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
            <GameInstructionsContent 
              setActiveSheet={setActiveSheet} 
              onPlay={() => { playTapSound(); setScreen('gameplay'); }} 
            />
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
            {/* The Straight-On Gameplay Device Container (Desktop) */}
            <div className="hidden md:flex relative h-[100dvh] w-auto max-w-none aspect-[3/2] items-center justify-center contain-content">
              <img
                src="/assets/desktop/gameplay.avif"
                alt="Game Console"
                className="w-full h-full object-cover pointer-events-none relative z-10"
              />

              {/* The Actual Game Canvas Mask */}
              {/* Using generous bleed percentages to hide perfectly behind the opaque red plastic */}
              <div
                className="absolute top-[18%] left-[30%] w-[39.5%] h-[75%] z-0 overflow-hidden transition-all duration-300 will-change-transform"
              >
                <RacingGame onExit={() => setScreen('instructions')} />
              </div>
            </div>

            {/* Mobile Gameplay Container */}
            <div className="md:hidden absolute inset-0 overflow-hidden flex items-center justify-center bg-white contain-content">
              <div className="relative h-full aspect-[1024/1536] shrink-0">
                <img
                  src="/assets/mobile/mobgameplay.avif"
                  alt="Game Console Mobile"
                  className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10"
                />
                
                {/* Mathematically precise mask for transparent area, with slight bleed on bottom to fill gaps */}
                <div
                  className="absolute top-[15.5%] left-[25%] w-[50%] h-[71%] z-0 overflow-hidden flex items-stretch justify-stretch transition-all duration-300 will-change-transform"
                >
                  <RacingGame isMobile={true} onExit={() => setScreen('instructions')} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Mobile Bottom Sheet Overlay */}
      <AnimatePresence>
        {activeSheet && (
          <GameMobileSheet activeSheet={activeSheet} setActiveSheet={setActiveSheet} />
        )}
      </AnimatePresence>
    </main>
  );
}
