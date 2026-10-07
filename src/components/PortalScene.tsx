import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { FlutedGlass } from "./FlutedGlass";
import { ImagePlane } from "./ImagePlane";
import { Hotspot } from "./Hotspot";

export function PortalScene({ isPlaying }: { isPlaying: boolean }) {
  const { camera, viewport } = useThree();
  const router = useRouter();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [showHotspot, setShowHotspot] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on mount (matches RacingGame.tsx logic exactly)
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext && !audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }

    const tl = gsap.timeline({ 
      paused: true, 
      onComplete: () => setShowHotspot(true) 
    });
    
    // Each background is exactly 15 units deep.
    // The camera starts at z = 5.
    // Easing power3.inOut creates the perfect start-slow, speed-up, end-slow curve.

    // Move continuously from bg1 straight to bg4 without stopping
    // The camera starts at z = 5. bg4 is at z = -45, so the camera stops at z = -40.
    // We use a single, smooth cinematic sweep.
    tl.to(camera.position, { z: -40, duration: 8, ease: "power3.inOut" });

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [camera]);

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

  useEffect(() => {
    if (isPlaying && timelineRef.current) {
      timelineRef.current.play();
    }
  }, [isPlaying]);

  return (
    <>
      <FlutedGlass isPlaying={isPlaying} />
      <ImagePlane texturePath="/bg2.png" zPosition={-15} />
      <ImagePlane texturePath="/bg3.png" zPosition={-30} />
      <ImagePlane texturePath="/bg4.png" zPosition={-45} />
      
      {/* The interactive Hotspot appears when camera stops at bg4 */}
      {/* Positioned exactly over the video game held between the seller and boy */}
      {showHotspot && (
        <Hotspot 
          position={[
            viewport.width * 0.05, 
            -(viewport.width / (16/9)) * 0.12, 
            -45.01
          ]} 
          onClick={() => {
            playTapSound();
            // Slight delay so the audio has time to fire before unmount/route
            setTimeout(() => router.push('/videogame'), 100);
          }}
        />
      )}
    </>
  );
}
