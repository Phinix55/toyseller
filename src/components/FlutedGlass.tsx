"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function FlutedGlass({ isPlaying, isMobile }: { isPlaying: boolean, isMobile?: boolean }) {
  const { viewport } = useThree();
  const texture = useTexture(isMobile ? "/mobbg1.avif" : "/bg1.avif");
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Shader logic for fluted glass
  const img = texture.image as any;
  const imageAspect = img ? img.width / img.height : 16 / 9;
  const viewportAspect = viewport.width / viewport.height;
  
  let planeWidth = viewport.width;
  let planeHeight = viewport.height;
  
  if (imageAspect > viewportAspect) {
    planeWidth = viewport.height * imageAspect;
  } else {
    planeHeight = viewport.width / imageAspect;
  }

  const uniforms = {
    uTexture: { value: texture },
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
    uOpacity: { value: 1.0 },
    uIsPlaying: { value: 0.0 },
    uBlurStrength: { value: 0.0 },
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
    uniform float uOpacity;
    uniform float uIsPlaying;
    uniform float uBlurStrength;
    varying vec2 vUv;

    void main() {
      vec2 center = vec2(0.5, 0.5);
      vec2 uv = vUv;
      
      float ridges = 120.0;
      float strength = mix(0.003, 0.0, uIsPlaying);
      float offset = sin(uv.x * ridges + uTime * 0.5) * strength;
      uv.x += offset;

      vec2 dir = uv - center;
      float dist = length(dir);
      
      // Keep the center perfectly clean, only blur the edges/corners
      float blurMask = smoothstep(0.15, 0.55, dist);
      float finalBlur = uBlurStrength * blurMask;

      vec4 color = vec4(0.0);
      float total = 0.0;
      
      for (int i = 0; i < 20; i++) {
          float percent = float(i) / 20.0;
          float weight = 1.0 - percent;
          vec2 sampleUv = uv - dir * percent * finalBlur;
          color += texture2D(uTexture, sampleUv) * weight;
          total += weight;
      }
      
      color /= total;
      gl_FragColor = vec4(color.rgb, color.a * uOpacity);
    }
  `;

  const lastZ = useRef(5); // Camera starts at z=5

  useFrame((state, delta) => {
    if (materialRef.current && meshRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
      
      // Ghosting Fade out
      const distance = state.camera.position.z - 0; // z is 0 for FlutedGlass
      
      // Dynamic Scaling: guarantee perfect full-screen coverage at all distances
      const absDistance = Math.abs(distance);
      const scaleFactor = Math.max(0.001, absDistance / 5.0);
      meshRef.current.scale.set(scaleFactor, scaleFactor, 1.0);

      let opacity = 1;
      if (distance < 3.0 && distance > 0) {
        opacity = Math.max(0, (distance - 0.5) / 2.5);
      } else if (distance <= 0) {
        opacity = 0;
      }
      materialRef.current.uniforms.uOpacity.value = opacity;
      // Smoothly remove fluted effect
      materialRef.current.uniforms.uIsPlaying.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uIsPlaying.value,
        isPlaying ? 1.0 : 0.0,
        0.1
      );

      // Radial Blur based on camera velocity
      const velocity = Math.abs(state.camera.position.z - lastZ.current);
      lastZ.current = state.camera.position.z;
      const targetBlur = velocity * 1.5; // Scale velocity to blur strength
      
      materialRef.current.uniforms.uBlurStrength.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uBlurStrength.value,
        targetBlur,
        0.2
      );
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
      <planeGeometry args={[planeWidth, planeHeight]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}
