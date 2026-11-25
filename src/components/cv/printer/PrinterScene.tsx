"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { PrinterBody, PRINTER } from "./PrinterBody";
import { PaperSheet } from "./PaperSheet";

/**
 * The scene. Chrome and the sheet both need something to reflect, so the
 * environment is built from Lightformers in-scene — no HDRI download. Tone
 * mapping is off (the canvas is `flat`) so the paper stays paper-white instead
 * of being pulled grey by a filmic curve.
 */

function Rig({
  feed,
  flipped,
  running,
  reduced,
  front,
  back,
  onBodyClick,
}: {
  feed: number;
  flipped: boolean;
  running: boolean;
  reduced: boolean;
  front: string;
  back: string;
  onBodyClick: () => void;
}) {
  const root = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!root.current) return;
    const t = state.clock.elapsedTime;
    const amp = reduced ? 0 : running ? 0.004 : 0.014;
    root.current.position.y = Math.sin(t * 0.9) * amp;
    root.current.rotation.y = Math.sin(t * 0.35) * (running ? 0.008 : 0.03);
  });

  return (
    <group ref={root}>
      <group
        onClick={onBodyClick}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <PrinterBody powered={running} />
      </group>
      <Suspense fallback={null}>
        <PaperSheet
          feed={feed}
          flipped={flipped}
          running={running}
          reduced={reduced}
          front={front}
          back={back}
        />
      </Suspense>
    </group>
  );
}

export function PrinterScene(props: {
  feed: number;
  flipped: boolean;
  running: boolean;
  reduced: boolean;
  front: string;
  back: string;
  onBodyClick: () => void;
}) {
  return (
    <Canvas
      flat
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.35, 4.35], fov: 34 }}
      onCreated={({ gl, camera }) => {
        gl.localClippingEnabled = true;
        camera.lookAt(0, -0.5, 0);
      }}
      onPointerMissed={() => props.onBodyClick()}
    >
      <hemisphereLight args={["#ffffff", "#d8d8dc", 0.55]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        castShadow
        position={[-1.4, 2.4, 3.6]}
        intensity={2.1}
        color="#fffaf0"
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.01}
      >
        <orthographicCamera attach="shadow-camera" args={[-3, 3, 3, -3, 0.1, 14]} />
      </directionalLight>
      <directionalLight position={[4, 1, 2]} intensity={0.55} color="#cfe0ff" />
      <directionalLight position={[0, -3, 3]} intensity={0.35} color="#ffffff" />

      <Environment resolution={128}>
        <Lightformer intensity={2.2} position={[0, 3, 2]} scale={[8, 3, 1]} />
        <Lightformer intensity={1.0} position={[-4, 1, 1]} scale={[3, 4, 1]} color="#e6ecff" />
        <Lightformer intensity={1.2} position={[4, 1, 1]} scale={[3, 4, 1]} color="#fff2df" />
        <Lightformer intensity={0.7} position={[0, -3, 2]} scale={[8, 2, 1]} />
      </Environment>

      {/* Backdrop: the machine reads as sitting against a wall, and it catches
          the sheet's shadow so the paper does not float in a void. */}
      <mesh position={[0, -0.4, -0.52]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#f6f6f7" roughness={1} metalness={0} />
      </mesh>

      <Rig {...props} />
    </Canvas>
  );
}

export { PRINTER };
