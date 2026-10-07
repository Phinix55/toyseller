import { motion } from "framer-motion";

interface GameIntroProps {
  setActiveSheet: (sheet: 'about' | 'story' | 'instructions' | null) => void;
  onPlay: () => void;
}

export function GameIntroContent({ setActiveSheet, onPlay }: GameIntroProps) {
  return (
    <>
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
        className="md:hidden absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-0 right-0 px-4 z-20 pointer-events-auto flex gap-3"
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
          src="/assets/desktop/videogame.avif"
          alt="Vintage Video Game"
          className="w-full h-auto max-h-[70vh] md:max-h-none object-contain drop-shadow-2xl relative z-10 pointer-events-none"
        />

        {/* Transparent Interactive Screen Overlay (Sitting behind the device bezel) */}
        <div
          className="absolute top-[10%] left-[30%] right-[30%] bottom-[62%] bg-[#8bac0f] hover:bg-[#9bbc0f] flex items-center justify-center cursor-pointer transition-all duration-300 z-0"
          onClick={onPlay}
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
    </>
  );
}
