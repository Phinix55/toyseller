"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function FlutedGlass() {
  const { viewport } = useThree();
  const texture = useTexture("/bg1.png");
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Shader logic for fluted glass
  const uniforms = {
    uTexture: { value: texture },
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
  };

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D uTexture;
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Fluted glass distortion (vertical ridges)
      float ridges = 120.0;
      float strength = 0.003;
      
      // Add slight time-based movement to the ridges for a premium feel
      float offset = sin(uv.x * ridges + uTime * 0.5) * strength;
      uv.x += offset;

      vec4 color = texture2D(uTexture, uv);
      gl_FragColor = color;
    }
  `;

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }

    // Parallax effect based on mouse cursor (X-axis only, subtle)
    if (meshRef.current) {
      const targetX = (state.pointer.x * viewport.width) / 100;
      
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Plane is slightly larger than viewport to avoid edges showing during parallax */}
      <planeGeometry args={[viewport.width * 1.1, viewport.height * 1.1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
