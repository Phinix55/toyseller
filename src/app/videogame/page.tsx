"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function VideoGamePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-8">
      {/* Back Button */}
      <button 
        onClick={() => router.push('/')}
        className="absolute top-8 left-8 text-black/60 hover:text-black transition-colors font-medium text-sm flex items-center gap-2"
      >
        <span>←</span> Back to Story
      </button>

      {/* Video Game Container */}
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-2xl mx-auto flex justify-center items-center"
      >
        <img 
          src="/videogame.png" 
          alt="Vintage Video Game" 
          className="w-full h-auto object-contain drop-shadow-2xl relative z-10 pointer-events-none" 
        />
        
        {/* Transparent Interactive Screen Overlay (Sitting behind the device bezel) */}
        <div 
          className="absolute top-[10%] left-[30%] right-[30%] bottom-[50%] bg-[#8bac0f] hover:bg-[#9bbc0f] flex items-center justify-center cursor-pointer transition-all duration-300 z-0"
          onClick={() => {
            console.log("Start game!");
            // Add game logic here
          }}
        >
          <div className="flex flex-col items-center gap-4">
            <p className="text-[#0f380f] font-pixel text-sm sm:text-base md:text-xl animate-pulse text-center leading-relaxed tracking-wider">
              TAP TO<br/>PLAY
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
