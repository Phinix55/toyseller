"use client";
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { FlutedGlass } from "./FlutedGlass";
import { ImagePlane } from "./ImagePlane";

export function PortalScene({ isPlaying }: { isPlaying: boolean }) {
  const { camera } = useThree();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const tl = gsap.timeline({ paused: true });
    
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
      <ImagePlane texturePath="/bg4.png" zPosition={-45} />
      <ImagePlane texturePath="/bg5.png" zPosition={-60} />
      <ImagePlane texturePath="/bg6.png" zPosition={-75} />
    </>
  );
}
