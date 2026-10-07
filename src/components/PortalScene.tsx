"use client";
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { FlutedGlass } from "./FlutedGlass";
import { ImagePlane } from "./ImagePlane";
import { Hotspot } from "./Hotspot";

export function PortalScene({ isPlaying }: { isPlaying: boolean }) {
  const { camera, viewport } = useThree();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [showHotspot, setShowHotspot] = useState(false);
  const [showToy, setShowToy] = useState(false);

  useEffect(() => {
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
      
      {/* bg4 is the current scene. When toy is shown, it shrinks and moves to the corner */}
      <ImagePlane texturePath="/bg4.png" zPosition={-45} minimizeToCorner={showToy} />
      
      {/* bg6 is exactly behind bg4. It gets seamlessly revealed when bg4 shrinks! */}
      <ImagePlane texturePath="/bg6.png" zPosition={-46} />
      
      {/* The interactive Hotspot appears when camera stops at bg4 */}
      {/* Positioned exactly over the video game held between the seller and boy */}
      {showHotspot && !showToy && (
        <Hotspot 
          position={[
            viewport.width * 0.05, 
            -(viewport.width / (16/9)) * 0.12, 
            -45.01
          ]} 
          onClick={() => setShowToy(true)} 
        />
      )}
    </>
  );
}
