import { motion } from "framer-motion";

interface GameMobileSheetProps {
  activeSheet: 'about' | 'story' | 'instructions' | null;
  setActiveSheet: (sheet: 'about' | 'story' | 'instructions' | null) => void;
}

export function GameMobileSheet({ activeSheet, setActiveSheet }: GameMobileSheetProps) {
  if (!activeSheet) return null;

  return (
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
        ) : activeSheet === 'story' ? (
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
        ) : (
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tighter text-black uppercase">
              Instructions
            </h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <kbd className="px-4 h-12 flex items-center justify-center bg-white border-2 border-black rounded-lg shadow-[0_4px_0_#1a1a1a] text-black font-black text-sm uppercase tracking-widest">
                    <span className="mr-2 text-lg">↔</span> SWIPE
                  </kbd>
                </div>
                <span className="text-black/80 font-bold tracking-wide text-base">STEER</span>
              </div>

              <div className="flex items-center gap-4">
                <kbd className="px-4 h-12 flex items-center justify-center bg-white border-2 border-black rounded-lg shadow-[0_4px_0_#1a1a1a] text-black font-black text-sm uppercase tracking-widest">
                  DOUBLE TAP
                </kbd>
                <span className="text-black/80 font-bold tracking-wide text-base">SHOOT (💀)</span>
              </div>
            </div>
            <p className="text-red-500/80 font-bold text-xs uppercase tracking-wider pt-4">
              * SPEED INCREASES WITH SCORE
            </p>
            <p className="text-black/60 font-bold text-xs uppercase tracking-wider pt-4 flex items-center gap-2">
              <span className="text-base">🎧</span> USE HEADPHONES FOR BETTER EXPERIENCE
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
}
