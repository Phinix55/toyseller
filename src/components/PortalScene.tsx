import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { FlutedGlass } from "./FlutedGlass";
import { ImagePlane } from "./ImagePlane";
import { Hotspot } from "./Hotspot";
import { useAudio } from "../hooks/useAudio";

export function PortalScene({ isPlaying, isMobile }: { isPlaying: boolean, isMobile?: boolean }) {
  const { camera, viewport } = useThree();
  const router = useRouter();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [showHotspot, setShowHotspot] = useState(false);
  const { playTapSound } = useAudio();

  useEffect(() => {
    const tl = gsap.timeline({ 
      paused: true
    });
    
    // Each background is exactly 15 units deep.
    // The camera starts at z = 5.
    // Easing power3.inOut creates the perfect start-slow, speed-up, end-slow curve.

    // Move continuously from bg1 straight to bg4 without stopping
    // The camera starts at z = 5. bg4 is at z = -45, so the camera stops at z = -40.
    // We use a single, smooth cinematic sweep.
    tl.to(camera.position, { z: -40, duration: 5, ease: "power3.inOut" });
    
    // Trigger the hotspot to appear slightly before the easing completely finishes.
    // This prevents the user from waiting for the camera's micro-movements to stop.
    tl.call(() => setShowHotspot(true), [], 4.2);

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [camera]);


  useEffect(() => {
    if (isPlaying && timelineRef.current) {
      timelineRef.current.play();
    }
  }, [isPlaying]);

  return (
    <>
      <FlutedGlass isPlaying={isPlaying} isMobile={isMobile} />
      <ImagePlane texturePath={isMobile ? "/assets/mobile/mobbg2.avif" : "/assets/desktop/bg2.avif"} zPosition={-15} />
      <ImagePlane texturePath={isMobile ? "/assets/mobile/mobbg3.avif" : "/assets/desktop/bg3.avif"} zPosition={-30} />
      <ImagePlane texturePath={isMobile ? "/assets/mobile/mobbg4.avif" : "/assets/desktop/bg4.avif"} zPosition={-45} />
      
      {/* The interactive Hotspot appears when camera stops at bg4 */}
      {/* Positioned exactly over the video game held between the seller and boy */}
      {showHotspot && (
        <Hotspot 
          position={
            isMobile
              ? [
                  viewport.width * 0.22, // Right side
                  -viewport.height * 0.14, // Downwards
                  -45.01
                ]
              : [
                  viewport.width * 0.05, 
                  -(viewport.width / (16/9)) * 0.12, 
                  -45.01
                ]
          }
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
