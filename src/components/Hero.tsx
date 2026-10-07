"use client";

import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PortalScene } from "./PortalScene";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
  const [isHindi, setIsHindi] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);



  // Tunnel Transition Sync & Mobile Detection
  useEffect(() => {
    // Mobile Detection
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Hard kill any rogue audio instantly on mount
    if (typeof window !== "undefined" && (window as any)._tunnelSfxGlobal) {
      try {
        (window as any)._tunnelSfxGlobal.pause();
        (window as any)._tunnelSfxGlobal.currentTime = 0;
      } catch (e) {}
    }

    let timeoutId: NodeJS.Timeout;
    let tunnelSfx: HTMLAudioElement | null = null;
    
    if (isPlaying) {
      // The camera sweep is 5s long. bg2 is at z=-15.
      // With power3.inOut easing, the camera passes bg1 and reaches bg2 around 2 seconds in.
      timeoutId = setTimeout(() => {
        tunnelSfx = new Audio('/tunneleffect.m4a');
        (window as any)._tunnelSfxGlobal = tunnelSfx;
        tunnelSfx.volume = 0.8;
        tunnelSfx.play().catch(e => console.warn(e));
      }, 2000);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (timeoutId) clearTimeout(timeoutId);
      if (tunnelSfx) {
        try {
          tunnelSfx.pause();
          tunnelSfx.currentTime = 0;
        } catch (e) {}
      }
      if (typeof window !== "undefined" && (window as any)._tunnelSfxGlobal) {
        try {
          (window as any)._tunnelSfxGlobal.pause();
          (window as any)._tunnelSfxGlobal.currentTime = 0;
        } catch (e) {}
      }
    };
  }, [isPlaying]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 3D WebGL Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <PortalScene isPlaying={isPlaying} isMobile={isMobile} />
          </Suspense>
        </Canvas>
      </div>

      {/* Dark Overlay for Text Legibility */}
      <motion.div 
        animate={{ opacity: isPlaying ? 0 : 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-[5] bg-black/40 pointer-events-none" 
      />

      {/* 2D UI Overlay Layer */}
      <motion.div 
        animate={{ opacity: isPlaying ? 0 : 1 }}
        transition={{ duration: 1 }}
        className={`absolute inset-0 z-10 pointer-events-none`}
      >
        {/* ============================================================== */}
        {/* DESKTOP UI (unchanged) */}
        {/* ============================================================== */}
        <div className="hidden md:flex flex-col justify-between p-8 h-full">
          {/* Top Header: Language Toggle */}
          <div className="w-full flex justify-end pointer-events-auto">
            <button
              onClick={() => setIsHindi(!isHindi)}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-2xl border border-white/30 rounded-full p-1 text-white text-sm shadow-xl hover:bg-white/30 transition-all duration-300"
            >
              <span className={`px-3 py-1 rounded-full transition-colors duration-300 ${isHindi ? 'bg-white text-black' : 'text-white/60'}`}>
                Hin
              </span>
              <span className={`px-3 py-1 rounded-full transition-colors duration-300 ${!isHindi ? 'bg-white text-black' : 'text-white/60'}`}>
                Eng
              </span>
            </button>
          </div>

          {/* Center Content: Dynamic Logo & Subline */}
          <div className="flex flex-col items-center justify-center -mt-20">
            <div className="h-[350px] flex items-center justify-center relative w-full max-w-5xl">
              <AnimatePresence mode="wait">
                {isHindi ? (
                  <motion.img
                    key="hindi"
                    src="/Khilonewala.avif"
                    alt="Khilonewala"
                    initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute w-full h-auto max-h-full object-contain drop-shadow-2xl"
                  />
                ) : (
                  <motion.img
                    key="english"
                    src="/toyseller.avif"
                    alt="Toy Seller"
                    initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute w-full h-auto max-h-full object-contain drop-shadow-2xl"
                  />
                )}
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-white/95 mt-6 text-2xl font-medium text-center leading-snug drop-shadow-lg"
              style={{ textShadow: "0 2px 15px rgba(0,0,0,0.6)" }}
            >
              Every toy holds a memory.<br />
              Dive into the story.
            </motion.p>
          </div>

          {/* Bottom CTA */}
          <div className="w-full flex justify-center pb-8 pointer-events-auto">
            <button 
              onClick={() => setIsPlaying(true)}
              className="group flex flex-col items-center gap-3"
            >
              <span className="text-white/60 text-sm tracking-[0.3em] uppercase group-hover:text-white transition-colors duration-500">
                Tap to enter
              </span>
              <div className="w-[1px] h-12 bg-white/30 group-hover:bg-white group-hover:h-16 transition-all duration-500 ease-out relative overflow-hidden">
                <motion.div
                  className="absolute top-0 w-full h-1/2 bg-white"
                  animate={{ y: ["-100%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MOBILE UI */}
        {/* ============================================================== */}
        <div className="flex md:hidden flex-col justify-between p-6 h-full">
          {/* Top Header: Language Toggle */}
          <div className="w-full flex justify-end pointer-events-auto">
            <button
              onClick={() => setIsHindi(!isHindi)}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-2xl border border-white/30 rounded-full p-1 text-white text-xs shadow-xl transition-all duration-300"
            >
              <span className={`px-3 py-1 rounded-full transition-colors duration-300 ${isHindi ? 'bg-white text-black font-medium' : 'text-white/60'}`}>
                Hin
              </span>
              <span className={`px-3 py-1 rounded-full transition-colors duration-300 ${!isHindi ? 'bg-white text-black font-medium' : 'text-white/60'}`}>
                Eng
              </span>
            </button>
          </div>

          {/* Center Content: Dynamic Logo & Subline */}
          <div className="flex flex-col items-center justify-center flex-1 -mt-10">
            <div className="h-[200px] flex items-center justify-center relative w-full px-4">
              <AnimatePresence mode="wait">
                {isHindi ? (
                  <motion.img
                    key="hindi-mob"
                    src="/Khilonewala.avif"
                    alt="Khilonewala"
                    initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute w-full h-auto max-h-full object-contain drop-shadow-2xl"
                  />
                ) : (
                  <motion.img
                    key="english-mob"
                    src="/toyseller.avif"
                    alt="Toy Seller"
                    initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute w-full h-auto max-h-full object-contain drop-shadow-2xl"
                  />
                )}
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-white/95 mt-6 text-lg font-medium text-center leading-snug drop-shadow-lg px-2"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
            >
              Every toy holds a memory.<br />
              Dive into the story.
            </motion.p>
          </div>

          {/* Bottom CTA */}
          <div className="w-full flex justify-center pb-6 pointer-events-auto">
            <button 
              onClick={() => setIsPlaying(true)}
              className="group flex flex-col items-center gap-2"
            >
              <span className="text-white/80 text-xs tracking-[0.25em] uppercase transition-colors duration-500">
                Tap to enter
              </span>
              <div className="w-[1px] h-10 bg-white/40 relative overflow-hidden">
                <motion.div
                  className="absolute top-0 w-full h-1/2 bg-white"
                  animate={{ y: ["-100%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
