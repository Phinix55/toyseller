import { Html } from "@react-three/drei";

export function Hotspot({ position, onClick }: { position: [number, number, number], onClick: () => void }) {
  return (
    <Html position={position} center zIndexRange={[100, 0]}>
      <div 
        className="flex flex-col items-center justify-center cursor-pointer group"
        onClick={onClick}
      >
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute w-full h-full rounded-full border border-white/40 animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute w-10 h-10 rounded-full border-2 border-white/80"></div>
          <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"></div>
        </div>
        <span className="mt-3 text-white uppercase tracking-widest text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md whitespace-nowrap bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
          Tap to see toy
        </span>
      </div>
    </Html>
  );
}
