"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * The printer itself, built to look like a real desktop machine rather than a
 * block: a rounded matte shell, a brushed metal top deck, a dark output slot
 * with rubber rollers, a chrome monogram and a warm "power" indicator.
 *
 * Dimensions are scene units; the whole machine is roughly 1.6 wide so the
 * camera frame stays consistent.
 */

export const PRINTER = {
  width: 1.6,
  height: 0.62,
  depth: 1.15,
  slotY: -0.12,
  slotDepth: 0.28,
};

const CHROME = "#e9e9ea";
const SHELL = "#141416";
const DECK = "#2b2b2b";

export function PrinterBody({ powered }: { powered: boolean }) {
  const { width: W, height: H, depth: D } = PRINTER;

  const shellGeo = useMemo(
    () => new RoundedBoxGeometry(W, H, D, 5, 0.06),
    [W, H, D],
  );
  const deckGeo = useMemo(
    () => new RoundedBoxGeometry(W - 0.06, 0.06, D - 0.06, 4, 0.03),
    [W, D],
  );

  return (
    <group>
      {/* Main shell */}
      <mesh castShadow receiveShadow geometry={shellGeo}>
        <meshStandardMaterial color={SHELL} roughness={0.55} metalness={0.35} envMapIntensity={0.8} />
      </mesh>

      {/* Top deck: brushed metal lid */}
      <mesh castShadow position={[0, H / 2 + 0.02, 0]} geometry={deckGeo}>
        <meshStandardMaterial color={DECK} roughness={0.42} metalness={0.6} envMapIntensity={1} />
      </mesh>

      {/* Output slot: a dark recessed mouth */}
      <mesh position={[0, PRINTER.slotY, D / 2 - 0.06]}>
        <boxGeometry args={[W - 0.16, 0.09, PRINTER.slotDepth]} />
        <meshStandardMaterial color="#050506" roughness={1} metalness={0} />
      </mesh>

      {/* Rollers inside the slot, turning while a job runs */}
      <Roller width={W - 0.24} y={PRINTER.slotY + 0.05} spinning={powered} />
      <Roller width={W - 0.24} y={PRINTER.slotY - 0.05} spinning={powered} />

      {/* Chrome monogram plate */}
      <mesh position={[-W / 2 + 0.22, H / 2 - 0.16, D / 2 + 0.005]}>
        <boxGeometry args={[0.28, 0.1, 0.02]} />
        <meshStandardMaterial color={CHROME} roughness={0.14} metalness={1} envMapIntensity={1.2} />
      </mesh>

      {/* Power indicator */}
      <mesh position={[W / 2 - 0.18, H / 2 - 0.16, D / 2 + 0.01]}>
        <cylinderGeometry args={[0.02, 0.02, 0.012, 16]} />
        <meshStandardMaterial
          color="#3a0d0d"
          emissive="#E10600"
          emissiveIntensity={powered ? 1.4 : 0.35}
          roughness={0.3}
        />
      </mesh>

      {/* Feet */}
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sz], i) => (
        <mesh key={i} position={[sx * (W / 2 - 0.14), -H / 2 - 0.005, sz * (D / 2 - 0.14)]}>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
          <meshStandardMaterial color="#0a0a0c" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Roller({ y, width, spinning }: { y: number; width: number; spinning: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current && spinning) ref.current.rotation.z -= dt * 7;
  });
  return (
    <mesh ref={ref} position={[0, y, PRINTER.depth / 2 - 0.16]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.028, 0.028, width, 20]} />
      <meshStandardMaterial color="#2a2a2e" roughness={0.9} />
    </mesh>
  );
}
