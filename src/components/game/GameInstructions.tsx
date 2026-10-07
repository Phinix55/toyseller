import { motion } from "framer-motion";

interface GameInstructionsProps {
  setActiveSheet: (sheet: 'about' | 'story' | 'instructions' | null) => void;
  onPlay: () => void;
}

export function GameInstructionsContent({ setActiveSheet, onPlay }: GameInstructionsProps) {
  return (
    <>
      {/* Left Side: Game Instructions (Desktop Only) */}
      <div className="hidden lg:flex w-full lg:w-[40%] h-full flex-col justify-end pb-16 px-8 lg:px-20 xl:px-24 bg-transparent relative z-10">
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
      <div className="flex w-full lg:w-[60%] h-full items-center justify-end relative z-0">
        
        {/* DESKTOP VISUAL */}
        <div className="hidden md:block relative h-full aspect-[3/2] shrink-0">
          {/* Tilted Digital Screen Overlay */}
          <div
            className="absolute top-[11%] left-[23%] w-[28%] h-[38%] bg-[#8bac0f] hover:bg-[#9bbc0f] flex items-center justify-center cursor-pointer -rotate-[13deg] transition-colors z-0"
            onClick={onPlay}
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
            src="/assets/desktop/bg6.avif"
            alt="Gameplay Preview"
            className="w-full h-full object-cover drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)] pointer-events-none relative z-10"
          />
        </div>

        {/* MOBILE VISUAL */}
        <div className="md:hidden relative w-full h-full shrink-0 flex items-center justify-center overflow-hidden">
          {/* Mobile Digital Screen Overlay perfectly sized for mobbg6.avif */}
          <div
            className="absolute top-[21.5%] left-[16%] w-[36%] h-[17.5%] bg-[#8bac0f] hover:bg-[#9bbc0f] flex items-center justify-center cursor-pointer -rotate-[8deg] transition-colors z-0"
            onClick={onPlay}
          >
            <div className="flex flex-col items-center justify-center gap-1.5 translate-y-2">
              <p className="text-[#0f380f] font-pixel text-[9px] text-center leading-[1.4] tracking-widest opacity-80">
                RACING<br />CHAMPION
              </p>
              <div className="border-[1.5px] border-[#0f380f] px-1.5 py-1 animate-pulse mt-0.5 translate-x-1">
                <p className="text-[#0f380f] font-pixel text-[6px] text-center tracking-[0.2em] whitespace-nowrap">
                  TAP TO PLAY
                </p>
              </div>
            </div>
          </div>

          <img
            src="/assets/mobile/mobbg6.avif"
            alt="Gameplay Preview Mobile"
            className="w-full h-full object-cover pointer-events-none relative z-10"
          />
        </div>
      </div>

      {/* Mobile Bottom Button */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="md:hidden absolute bottom-6 left-0 right-0 px-4 z-20 pointer-events-auto flex"
      >
        <button 
          onClick={() => setActiveSheet('instructions')}
          className="flex-1 bg-black text-white font-black py-4 rounded-xl shadow-xl uppercase tracking-wider text-sm border-2 border-black active:scale-95 transition-transform"
        >
          View Instructions
        </button>
      </motion.div>
    </>
  );
}
