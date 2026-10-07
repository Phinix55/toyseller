"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { FlutedGlass } from "./FlutedGlass";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
  const [isHindi, setIsHindi] = useState(true);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 3D WebGL Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <FlutedGlass />
        </Canvas>
      </div>

      {/* Dark Overlay for Text Legibility */}
      <div className="absolute inset-0 z-[5] bg-black/40 pointer-events-none" />

      {/* 2D UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8">

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
                  src="/Khilonewala.png"
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
                  src="/toyseller.png"
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
          <button className="group flex flex-col items-center gap-3">
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
    </div>
  );
}
