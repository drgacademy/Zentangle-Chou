"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";

const fragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec3 uColorBase;
uniform vec3 uColorEdge;
uniform float uGrain;
uniform float uVignette;

// Hash + 2D value noise for paper grain.
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 78.233);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.05;
    a *= 0.5;
  }
  return v;
}

void main() {
  // Slow warp synced with breathing.
  vec2 warp = vec2(
    fbm(vUv * 2.5 + vec2(uTime * 0.0006, 0.0)) - 0.5,
    fbm(vUv * 2.5 + vec2(0.0, uTime * 0.0006)) - 0.5
  );
  vec2 uv = vUv + warp * 0.012;

  // Multi-octave grain.
  float grain = fbm(uv * 80.0) * 0.55 + fbm(uv * 240.0) * 0.45;
  grain = (grain - 0.5) * uGrain;

  // Edge vignette.
  float d = length(vUv - 0.5);
  float vignette = smoothstep(0.45, 0.95, d) * uVignette;

  vec3 color = mix(uColorBase, uColorEdge, vignette);
  color += grain;

  gl_FragColor = vec4(color, 1.0);
}
`;

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

function PaperPlane({ dark }: { dark: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorBase: { value: new THREE.Color(dark ? "#1B1A18" : "#F0E4C8") },
      uColorEdge: { value: new THREE.Color(dark ? "#0E0D0B" : "#D8C9A1") },
      uGrain: { value: 0.06 },
      uVignette: { value: 0.55 },
    }),
    [dark]
  );

  useEffect(() => {
    if (!matRef.current) return;
    (matRef.current.uniforms.uColorBase.value as THREE.Color).set(dark ? "#1B1A18" : "#F0E4C8");
    (matRef.current.uniforms.uColorEdge.value as THREE.Color).set(dark ? "#0E0D0B" : "#D8C9A1");
  }, [dark]);

  useFrame((_, dt) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += dt * 1000;
    }
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function PaperBackgroundInner() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const update = () => setDark(document.documentElement.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1], near: 0, far: 1, zoom: 1 }}
      gl={{ antialias: false, alpha: false }}
      dpr={[1, 2]}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <PaperPlane dark={dark} />
    </Canvas>
  );
}
