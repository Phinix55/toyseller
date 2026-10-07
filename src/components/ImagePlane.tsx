"use client";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function ImagePlane({ texturePath, zPosition }: { texturePath: string, zPosition: number }) {
  const texture = useTexture(texturePath);
  const { viewport, camera } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const targetScaleMult = useRef(1.0);
  const currentPos = useRef(new THREE.Vector3(0, 0, zPosition));

  // Fit the width perfectly without any artificial zooming
  // Maintain the natural aspect ratio of the image for the height
  const img = texture.image as any;
  const imageAspect = img ? img.width / img.height : 16 / 9;
  const planeWidth = viewport.width;
  const planeHeight = viewport.width / imageAspect;

  const uniforms = useRef({
    uTexture: { value: texture },
    uOpacity: { value: 1.0 },
    uBlurStrength: { value: 0.0 }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D uTexture;
    uniform float uOpacity;
    uniform float uBlurStrength;
    varying vec2 vUv;

    void main() {
      vec2 center = vec2(0.5, 0.5);
      vec2 dir = vUv - center;
      float dist = length(dir);

      // Keep the center perfectly clean, only blur the edges/corners
      float blurMask = smoothstep(0.15, 0.55, dist);
      float finalBlur = uBlurStrength * blurMask;

      vec4 color = vec4(0.0);
      float total = 0.0;
      
      for (int i = 0; i < 20; i++) {
          float percent = float(i) / 20.0;
          float weight = 1.0 - percent;
          vec2 sampleUv = vUv - dir * percent * finalBlur;
          color += texture2D(uTexture, sampleUv) * weight;
          total += weight;
      }
      
      color /= total;
      gl_FragColor = vec4(color.rgb, color.a * uOpacity);
    }
  `;

  const lastZ = useRef(5);

  useFrame(() => {
    if (materialRef.current && meshRef.current) {
      const distance = camera.position.z - zPosition;

      // Dynamic Scaling: guarantee perfect full-screen coverage at all distances
      const absDistance = Math.abs(distance);
      const scaleFactor = Math.max(0.001, absDistance / 5.0);
      meshRef.current.scale.set(scaleFactor, scaleFactor, 1.0);
      
      // The "Ghosting" Fade Effect
      // Start fading out elegantly as the camera approaches to prevent clipping
      let opacity = 1;
      if (distance < 4.0 && distance > 0) {
        opacity = Math.max(0, (distance - 1.0) / 3.0);
      } else if (distance <= 0) {
        opacity = 0;
      }
      // Radial Blur based on camera velocity
      const velocity = Math.abs(camera.position.z - lastZ.current);
      lastZ.current = camera.position.z;
      const targetBlur = velocity * 1.5;

      materialRef.current.uniforms.uOpacity.value = opacity;
      materialRef.current.uniforms.uBlurStrength.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uBlurStrength.value,
        targetBlur,
        0.2
      );
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, zPosition]}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <shaderMaterial 
        ref={materialRef} 
        uniforms={uniforms.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}
