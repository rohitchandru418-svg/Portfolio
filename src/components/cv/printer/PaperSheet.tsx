"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { PRINTER } from "./PrinterBody";
import { PaperCloth, SHEET_H } from "./paperCloth";

/**
 * The sheet of paper.
 *
 * The geometry is a simulated cloth (see paperCloth.ts) clipped by the slot
 * plane, so the sheet appears to feed out of the printer and then hangs and
 * waves. The real CV is mapped onto it: front on one face, second page on the
 * other, so flipping reads the reverse.
 */

export function PaperSheet({
  feed,
  flipped,
  running,
  front,
  back,
  reduced,
}: {
  feed: number;
  flipped: boolean;
  running: boolean;
  front: string;
  back: string;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const flipRef = useRef(0);
  const [frontTex, backTex] = useLoader(THREE.TextureLoader, [front, back]);
  const cloth = useMemo(() => new PaperCloth(), []);

  useEffect(() => () => cloth.dispose(), [cloth]);

  useEffect(() => {
    frontTex.colorSpace = THREE.SRGBColorSpace;
    frontTex.anisotropy = 8;
    // The reverse mesh is rotated 180°, which mirrors its UVs; undo that.
    backTex.colorSpace = THREE.SRGBColorSpace;
    backTex.anisotropy = 8;
    backTex.wrapS = THREE.RepeatWrapping;
    backTex.repeat.x = -1;
    frontTex.needsUpdate = true;
    backTex.needsUpdate = true;
  }, [frontTex, backTex]);

  // Clip everything above the slot: that is the part still inside the machine.
  const clip = useMemo(
    () => [new THREE.Plane(new THREE.Vector3(0, -1, 0), PRINTER.slotY)],
    [],
  );

  const materialProps = useMemo(
    () => ({
      roughness: 0.8,
      metalness: 0,
      sheen: 0.25,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color("#ffffff"),
      specularIntensity: 0.18,
      envMapIntensity: 0.45,
      clippingPlanes: clip,
      clipShadows: true,
    }),
    [clip],
  );

  useFrame((state, dt) => {
    const step = Math.min(dt, 1 / 30);
    const energy = reduced ? 0 : running || feed < 1 ? 1 : 0.35;
    cloth.step(step, state.clock.elapsedTime, energy);

    const grp = group.current;
    if (!grp) return;

    const target = flipped ? 1 : 0;
    flipRef.current += (target - flipRef.current) * Math.min(step * 7, 1);

    // The sheet travels from fully inside the slot (feed 0) to fully out (1).
    grp.position.set(0, PRINTER.slotY + SHEET_H * (0.5 - feed), PRINTER.depth / 2 + 0.03);
    grp.rotation.y = flipRef.current * Math.PI;
    // A slight forward lean while still feeding, so it clears the machine.
    grp.rotation.x = (1 - feed) * 0.12;
  });

  return (
    <group ref={group}>
      <mesh castShadow receiveShadow geometry={cloth.geometry}>
        <meshPhysicalMaterial map={frontTex} side={THREE.FrontSide} {...materialProps} />
      </mesh>
      <mesh castShadow receiveShadow geometry={cloth.geometry} rotation={[0, Math.PI, 0]}>
        <meshPhysicalMaterial map={backTex} side={THREE.FrontSide} {...materialProps} />
      </mesh>
    </group>
  );
}
