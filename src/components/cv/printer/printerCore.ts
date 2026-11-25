/**
 * The CV printer, ported from the get-daffed.com scene so the motion matches it
 * frame for frame.
 *
 * It is deliberately NOT React: the reference drives everything from one
 * requestAnimationFrame loop with a fixed-timestep cloth solver, and re-creating
 * that with hooks would only add re-render churn. React mounts it, hands it a
 * container, and gets back a tiny imperative handle.
 *
 * The machine is a flat plate rather than a box — a brushed chrome lid, a dark
 * throat, two rubber rollers, two red light bars and a round press button.
 * The sheet is a 23x33 verlet cloth pinned at the slot, clipped by a plane at
 * the slot, then flown out along a scripted path once it clears the machine.
 *
 *   idle -> warm -> feed -> hold -> fall -> settled   (and clear, for a re-run)
 */

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type Phase = "idle" | "warm" | "feed" | "hold" | "fall" | "settled" | "clear";

export type MountOptions = {
  reduced?: boolean;
  compact?: boolean;
  frame?: { w: number; bottomPx: number };
  sway?: number;
  onPhase?: (phase: Phase) => void;
  onPrinted?: () => void;
  onError?: () => void;
};

export type PrinterHandle = {
  print: () => void;
  resize: () => void;
  readonly phase: Phase;
  destroy: () => void;
};

export function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      c.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
      c.getContext("webgl", { failIfMajorPerformanceCaveat: true })
    );
  } catch {
    return false;
  }
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const smoothstep = (a: number, b: number, t: number) => {
  const r = clamp((t - a) / (b - a), 0, 1);
  return r * r * (3 - 2 * r);
};
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * The round push-button on the machine's face. It is a two-part control: a
 * fixed dark socket and a chrome cap that travels along Z. Pressed in while a
 * job runs, popped back out when the sheet is done — so the machine's control
 * and the drawer's copy agree about what state the printer is in.
 */
function buildButton(): {
  group: THREE.Group;
  cap: THREE.Mesh;
  ring: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshBasicMaterial>;
} {
  const group = new THREE.Group();

  const socket = new THREE.Mesh(
    new THREE.CylinderGeometry(0.052, 0.056, 0.03, 32, 1),
    new THREE.MeshStandardMaterial({ color: "#0b0b0c", roughness: 0.55, metalness: 0.35 }),
  );
  socket.rotation.x = Math.PI / 2;
  group.add(socket);

  // Violet collar that lights up while the machine is working.
  const ring = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.006, 32, 1),
    new THREE.MeshBasicMaterial({ color: "#7c3aed", transparent: true, opacity: 0 }),
  ) as THREE.Mesh<THREE.CylinderGeometry, THREE.MeshBasicMaterial>;
  ring.rotation.x = Math.PI / 2;
  ring.position.z = 0.006;
  group.add(ring);

  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.046, 0.046, 0.026, 40, 1),
    new THREE.MeshPhysicalMaterial({
      color: "#ececed",
      metalness: 1,
      roughness: 0.24,
      envMapIntensity: 1.1,
      clearcoat: 0.6,
      clearcoatRoughness: 0.1,
    }),
  );
  cap.rotation.x = Math.PI / 2;
  cap.castShadow = true;
  group.add(cap);

  return { group, cap, ring };
}

export function mountPrinter(
  container: HTMLElement,
  opts: MountOptions = {},
): PrinterHandle {
  const reduced = !!opts.reduced;
  const compact =
    !!opts.compact || window.matchMedia("(pointer: coarse)").matches;

  // ---- renderer -----------------------------------------------------------
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setClearColor(0, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  container.appendChild(canvas);

  // ---- scene, camera, environment ----------------------------------------
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.03);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.75;

  scene.add(new THREE.HemisphereLight("#ffffff", "#d9d6cf", 0.3));
  const key = new THREE.DirectionalLight("#fffaf0", 0.6);
  key.position.set(-0.7, 1.7, 4.6);
  key.castShadow = true;
  key.shadow.mapSize.set(compact ? 1024 : 2048, compact ? 1024 : 2048);
  Object.assign(key.shadow.camera, {
    left: -2.6,
    right: 2.6,
    top: 2.2,
    bottom: -4.2,
    near: 0.5,
    far: 12,
  });
  key.shadow.radius = 5;
  key.shadow.bias = -4e-4;
  key.shadow.normalBias = 0.01;
  scene.add(key, key.target);

  // ---- geometry constants -------------------------------------------------
  const D = 1 * Math.SQRT2; // sheet height; width is 1
  const slotY = D / 2 + 0.06; // slot plane / clip constant (local to the machine)
  const stepX = 1 / 22;
  const stepY = D / 32;
  const Oe = 0.07; // the sheet's resting depth inside the slot
  const cols = 23;
  const rows = 33;
  const verts = cols * rows; // 759

  // ---- backdrop + floor ---------------------------------------------------
  // ShadowMaterial keeps both planes invisible except where the machine and the
  // sheet cast onto them, so the paper appears to float over the drawer rather
  // than sit on an opaque white wall that would swallow its white.
  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    new THREE.ShadowMaterial({ color: "#2a2418", opacity: 0.085 }),
  );
  backdrop.position.z = -0.42;
  backdrop.receiveShadow = true;
  scene.add(backdrop);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 3),
    new THREE.ShadowMaterial({ color: "#2a2418", opacity: 0.16 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 1);
  floor.receiveShadow = true;
  scene.add(floor);

  // ---- the machine --------------------------------------------------------
  const machine = new THREE.Group();
  scene.add(machine);

  const chromeMat = new THREE.MeshStandardMaterial({
    color: "#e9e9ea",
    metalness: 1,
    roughness: 0.14,
  });
  const lid = new THREE.Mesh(new RoundedBoxGeometry(1.34, 0.17, 0.3, 5, 0.06), chromeMat);
  lid.position.y = 0.089;
  lid.castShadow = true;
  machine.add(lid);

  const darkMat = new THREE.MeshStandardMaterial({ color: "#111", roughness: 0.4, metalness: 0.3 });
  const throat = new THREE.Mesh(new RoundedBoxGeometry(1.14, 0.022, 0.09, 2, 0.008), darkMat);
  throat.position.y = 0.008;
  machine.add(throat);

  // Light bars that glow while a job runs.
  const barMat = new THREE.MeshBasicMaterial({
    color: "#7c3aed",
    transparent: true,
    opacity: reduced ? 0.35 : 0,
  });
  const barGeo = new THREE.BoxGeometry(1.08, 0.004, 0.012);
  const barFront = new THREE.Mesh(barGeo, barMat);
  barFront.position.set(0, -0.004, 0.026);
  const barBack = new THREE.Mesh(barGeo, barMat);
  barBack.position.set(0, -0.004, -0.026);
  machine.add(barFront, barBack);

  const glow = new THREE.PointLight("#a855f7", 0, 0.9, 1.6);
  glow.position.set(0, -0.06, 0.16);
  machine.add(glow);

  // Rollers, with rubber nubs so they read as rubber.
  const rollerMat = new THREE.MeshStandardMaterial({ color: "#2b2b2b", roughness: 0.75, metalness: 0.1 });
  const rollerGeo = new THREE.CylinderGeometry(0.012, 0.012, 1.04, 18, 1);
  rollerGeo.rotateZ(Math.PI / 2);
  const nubMat = new THREE.MeshStandardMaterial({ color: "#8a8a8a", roughness: 0.4, metalness: 0.6 });
  const rollers = [0.02, -0.02].map((z) => {
    const r = new THREE.Mesh(rollerGeo, rollerMat);
    r.position.set(0, -0.006, z);
    machine.add(r);
    for (let t = -4; t <= 4; t++) {
      const nub = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.026, 0.004), nubMat);
      nub.position.x = t * 0.12;
      r.add(nub);
    }
    return r;
  });

  // Power LED.
  const ledMat = new THREE.MeshStandardMaterial({
    color: "#2e1065",
    emissive: "#7c3aed",
    emissiveIntensity: 0.25,
    roughness: 0.2,
  });
  const led = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.02, 20, 12), ledMat);
  led.position.set(0.56, 0.095, 0.152);
  led.scale.z = 0.5;
  machine.add(led);

  // The press button on the machine's face.
  const { group: button, cap: buttonCap, ring: buttonRing } = buildButton();
  button.position.set(-0.55, 0.092, 0.162);
  machine.add(button);

  // ---- the sheet ----------------------------------------------------------
  const hiRes = !compact && Math.min(window.innerWidth, window.innerHeight) > 600;
  const loader = new THREE.TextureLoader();
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  // A failed texture fetch must not leave a blank sheet on screen: hand the
  // problem to the host, which swaps in the CSS fallback.
  let failed = false;
  const onTexFail = () => {
    if (failed) return;
    failed = true;
    opts.onError?.();
  };
  const load = (n: number) => {
    const tex = loader.load(
      `/cv/page-${n}${hiRes ? "" : "-sm"}.webp`,
      undefined,
      undefined,
      onTexFail,
    );
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = maxAniso;
    return tex;
  };
  const frontTex = load(1);
  const backTex = load(2);
  backTex.wrapS = THREE.RepeatWrapping;
  backTex.repeat.x = -1;

  const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), slotY);
  const paperProps = {
    roughness: 0.8,
    metalness: 0,
    sheen: 0.2,
    sheenRoughness: 0.5,
    sheenColor: new THREE.Color("#ffffff"),
    specularIntensity: 0.16,
    envMapIntensity: 0.42,
    clippingPlanes: [clipPlane],
    clipShadows: true,
    transparent: true,
    opacity: 1,
  };
  const frontMat = new THREE.MeshPhysicalMaterial({ map: frontTex, side: THREE.FrontSide, ...paperProps });
  const backMat = new THREE.MeshPhysicalMaterial({ map: backTex, side: THREE.BackSide, ...paperProps });

  const sheetGeo = new THREE.PlaneGeometry(1, D, cols - 1, rows - 1);
  const front = new THREE.Mesh(sheetGeo, frontMat);
  const back = new THREE.Mesh(sheetGeo, backMat);
  front.castShadow = true;
  front.frustumCulled = false;
  back.frustumCulled = false;

  // The sheet's shadow must be clipped by the same plane as the sheet.
  const uPlane = { value: new THREE.Vector4(0, -1, 0, slotY) };
  const depthMat = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
    side: THREE.DoubleSide,
  });
  depthMat.onBeforeCompile = (shader) => {
    shader.uniforms.uPlane = uPlane;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWP;")
      .replace(
        "#include <project_vertex>",
        "#include <project_vertex>\nvWP = (modelMatrix * vec4(transformed, 1.0)).xyz;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWP;\nuniform vec4 uPlane;")
      .replace(
        "void main() {",
        "void main() {\n  if (dot(uPlane.xyz, vWP) + uPlane.w < 0.0) discard;",
      );
  };
  front.customDepthMaterial = depthMat;
  scene.add(front, back);

  // ---- mutable state ------------------------------------------------------
  const P = sheetGeo.attributes.position.array as Float32Array;
  const prevPos = new Float32Array(P); // F
  const pinned = new Uint8Array(verts); // I
  const initPos = new Float32Array(P);

  let feed = Oe; // z: how deep the pinned edge sits inside the slot
  let phase: Phase = "idle";
  let phaseT = 0;
  let clock = 0; // wall time: floats, breathing, button motion
  let solverT = 0; // solver time: only advances while the cloth is simulated
  let printWind = 0;
  let flip = 0; // K
  let flipTarget = 0; // q
  let settle = 0; // Ot
  let flutter = 0; // kt
  let floorY = slotY - D - 0.62;
  let fadeIn = 1; // used to bring the sheet back after a re-print
  let hover: "printer" | "sheet" | null = null;
  let hoverSet = false;

  const poke = { x: 0, y: 0, vx: 0, vy: 0, active: false, strength: 0 };
  const held = new Float32Array(verts * 3);
  let centroid = { x: 0, y: 0, z: 0 };
  const pose = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 };
  const FALL = 2.9;
  const sway = opts.sway ?? 0.42;
  const HOME = { x: 0.06, z: -0.1, rx: -0.2, rz: -0.1 };

  const qYaw = new THREE.Quaternion();
  const qPitch = new THREE.Quaternion();
  const qRoll = new THREE.Quaternion();
  const axisX = new THREE.Vector3(1, 0, 0);
  const axisY = new THREE.Vector3(0, 1, 0);
  const axisZ = new THREE.Vector3(0, 0, 1);

  const machineWorld = new THREE.Matrix4();
  const tmpV = new THREE.Vector3();
  const tmpV2 = new THREE.Vector3();

  // ---- cloth constraints --------------------------------------------------
  const ca: number[] = [];
  const cb: number[] = [];
  const ck: number[] = [];
  const idx = (r: number, c: number) => r * cols + c;
  const link = (a: number, b: number, k: number) => {
    ca.push(a);
    cb.push(b);
    ck.push(k);
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c < 22) link(idx(r, c), idx(r, c + 1), 1);
      if (r < 32) link(idx(r, c), idx(r + 1, c), 1);
      if (r < 32 && c < 22) {
        link(idx(r, c), idx(r + 1, c + 1), 1);
        link(idx(r, c + 1), idx(r + 1, c), 1);
      }
      if (c < 21) link(idx(r, c), idx(r, c + 2), 0.95);
      if (r < 31) link(idx(r, c), idx(r + 2, c), 0.9);
      if (c < 19) link(idx(r, c), idx(r, c + 4), 0.7);
      if (r < 29) link(idx(r, c), idx(r + 4, c), 0.5);
    }
  }
  const cArr = Int32Array.from(ca);
  const cBrr = Int32Array.from(cb);
  const cKrr = Float32Array.from(ck);
  const restLen = new Float32Array(cArr.length);
  for (let e = 0; e < cArr.length; e++) {
    const t = cArr[e] * 3;
    const n = cBrr[e] * 3;
    restLen[e] = Math.hypot(initPos[t] - initPos[n], initPos[t + 1] - initPos[n + 1]);
  }

  // ---- solver -------------------------------------------------------------
  const placePinned = (r: number, c: number, out: THREE.Vector3) =>
    out.set(-1 / 2 + c * stepX, (32 - r) * stepY - feed, 0).applyMatrix4(machineWorld);

  function layout() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = idx(r, c) * 3;
        placePinned(r, c, tmpV);
        P[i] = prevPos[i] = initPos[i] = tmpV.x;
        P[i + 1] = prevPos[i + 1] = initPos[i + 1] = tmpV.y;
        P[i + 2] = prevPos[i + 2] = initPos[i + 2] = tmpV.z;
      }
    }
  }

  function stepCloth(dt: number) {
    solverT += dt;
    const nrm = sheetGeo.attributes.normal.array as Float32Array;
    const damp = 0.972;
    const windAmp = reduced ? 0 : 0.45;
    for (let a = 0; a < verts; a++) {
      const o = a * 3;
      if ((32 - ((a / cols) | 0)) * stepY > feed - 1e-4) {
        pinned[a] = 1;
        continue;
      }
      pinned[a] = 0;
      const x = P[o];
      const y = P[o + 1];
      const z = P[o + 2];
      const vx = (x - prevPos[o]) * damp;
      const vy = (y - prevPos[o + 1]) * damp;
      const vz = (z - prevPos[o + 2]) * damp;
      const h = machine.position.y - y;
      const m =
        windAmp *
        (0.55 + 0.45 * Math.sin(solverT * 0.8 + x * 1.7 + y * 0.6) * Math.cos(solverT * 0.53 - y * 2.1));
      const nx = nrm[o];
      const ny = nrm[o + 1];
      const nz = nrm[o + 2];
      const wind = m * nz;
      const grav = (h / D) * 0.9 * (h / D);
      let axAcc = nx * wind * 1.4;
      let ayAcc = -5.2 + ny * wind * 1.4;
      let azAcc = nz * wind * 1.4 + grav;
      if (printWind > 0) {
        azAcc += printWind * 3.6 * Math.sin(h * 5 - solverT * 7.5) * smoothstep(0.02, 0.4, h);
        axAcc += printWind * 0.35 * Math.sin(h * 3 - solverT * 5 + x * 2);
      }
      if (poke.strength > 0.001) {
        const dx = x - poke.x;
        const dy = y - poke.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.42) {
          const f = Math.pow(1 - dist / 0.42, 2) * poke.strength;
          azAcc -= f * 4.5;
          axAcc += poke.vx * f * 0.5;
          ayAcc += poke.vy * f * 0.3;
        }
      }
      prevPos[o] = x;
      prevPos[o + 1] = y;
      prevPos[o + 2] = z;
      P[o] = x + vx + axAcc * dt * dt;
      P[o + 1] = y + vy + ayAcc * dt * dt;
      P[o + 2] = z + vz + azAcc * dt * dt;
    }
    for (let a = 0; a < verts; a++) {
      if (!pinned[a]) continue;
      const o = a * 3;
      placePinned((a / cols) | 0, a % cols, tmpV);
      prevPos[o] = P[o];
      prevPos[o + 1] = P[o + 1];
      prevPos[o + 2] = P[o + 2];
      P[o] = tmpV.x;
      P[o + 1] = tmpV.y;
      P[o + 2] = tmpV.z;
    }
    const iters = compact ? 10 : 16;
    for (let it = 0; it < iters; it++) {
      for (let e = 0; e < cArr.length; e++) {
        const a = cArr[e];
        const b = cBrr[e];
        const pa = pinned[a];
        const pb = pinned[b];
        if (pa && pb) continue;
        const ao = a * 3;
        const bo = b * 3;
        const dx = P[bo] - P[ao];
        const dy = P[bo + 1] - P[ao + 1];
        const dz = P[bo + 2] - P[ao + 2];
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
        let d = ((len - restLen[e]) / len) * cKrr[e];
        if (d < 0 && cKrr[e] < 1) d *= 0.85;
        const fa = pa ? 0 : pb ? 1 : 0.5;
        const fb = pb ? 0 : pa ? 1 : 0.5;
        P[ao] += dx * d * fa;
        P[ao + 1] += dy * d * fa;
        P[ao + 2] += dz * d * fa;
        P[bo] -= dx * d * fb;
        P[bo + 1] -= dy * d * fb;
        P[bo + 2] -= dz * d * fb;
      }
    }
    for (let a = 0; a < verts; a++) {
      if (!pinned[a] && P[a * 3 + 2] < -0.36) P[a * 3 + 2] = -0.36;
    }
  }

  // ---- flight path (hold -> settled) --------------------------------------
  function flyPath(e: number) {
    const t = clamp(e / FALL, 0, 1);
    const s1 = Math.sin(Math.PI * 2 * 1.3 * t);
    const c1 = Math.cos(Math.PI * 2 * 1.3 * t);
    const flourish = Math.pow(1 - t, 0.8) * smoothstep(0, 0.22, t);
    const landing = smoothstep(0.62, 1, t);
    const restY = floorY + (D / 2) * Math.cos(HOME.rx) + 0.004;
    const reach = smoothstep(0, 1, t) * 0.45 + Math.min(1, t * 1.05) * 0.55;
    pose.y = centroid.y + (restY - centroid.y) * clamp(reach, 0, 1);
    pose.x = centroid.x + sway * s1 * flourish + (HOME.x - centroid.x) * landing;
    pose.z = centroid.z + 0.16 * Math.sin(Math.PI * t) + (HOME.z - centroid.z) * landing;
    pose.rz = 0.5 * c1 * flourish * (1 - landing) + HOME.rz * landing;
    pose.ry = Math.PI * smoothstep(0.06, 0.62, t) + 0.32 * s1 * flourish * (1 - landing);
    pose.rx = 0.55 * Math.sin(Math.PI * 2 * 0.95 * t) * flourish * (1 - landing) + HOME.rx * landing;
    flutter = (1 - landing) * smoothstep(0, 0.15, t);
    settle = smoothstep(0.82, 1, t);
  }

  function applyPose(blend: number, e: number) {
    qYaw.setFromAxisAngle(axisY, pose.ry + Math.PI * easeInOutCubic(flip));
    qPitch.setFromAxisAngle(axisX, pose.rx);
    qRoll.setFromAxisAngle(axisZ, pose.rz);
    qRoll.multiply(qPitch).multiply(qYaw);
    const bob = Math.sin(Math.PI * flip);
    const fold = 2.5 * (settle * (1 - flip));
    const a = -D / 2;
    const o = -Math.SQRT1_2;
    const s = -Math.SQRT1_2;
    const cc = -0.5 * o + a * s - 0.17;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = idx(r, c) * 3;
        let d = -1 / 2 + c * stepX;
        let f = D / 2 - r * stepY;
        let p =
          0.05 * Math.pow(f / (D / 2), 2) * (1 - 0.6 * settle) +
          flutter * 0.05 * Math.sin(f * 3.2 + e * 9) * Math.cos(d * 1.6 + e * 4);
        if (fold > 0.001) {
          const side = d * o + f * s - cc;
          if (side > 0) {
            const dd = d - side * o;
            const ff = f - side * s;
            d = dd + side * Math.cos(fold) * o;
            f = ff + side * Math.cos(fold) * s;
            p += -side * Math.sin(fold);
          }
        }
        tmpV.set(d, f, p).applyQuaternion(qRoll);
        const tx = pose.x + tmpV.x;
        const ty = pose.y + tmpV.y + bob * 0.05;
        const tz = pose.z + tmpV.z + bob * 0.14;
        if (blend < 1) {
          P[i] = held[i] + (tx - held[i]) * blend;
          P[i + 1] = held[i + 1] + (ty - held[i + 1]) * blend;
          P[i + 2] = held[i + 2] + (tz - held[i + 2]) * blend;
        } else {
          P[i] = tx;
          P[i + 1] = ty;
          P[i + 2] = tz;
        }
      }
    }
  }

  // ---- responsive framing -------------------------------------------------
  const frameW = opts.frame?.w ?? 2.05;
  const bottomPx = opts.frame?.bottomPx ?? 24;
  const topY = slotY + 0.24;
  const totalH = 0.24 + D + 0.32;
  function resize() {
    const rect = container.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    let scale = w / frameW;
    if ((h - bottomPx) / scale < totalH) scale = (h - bottomPx) / totalH;
    const visible = h / scale;
    floorY = topY - visible + bottomPx / scale;
    floor.position.y = floorY;
    const dist = h / (2 * Math.tan((camera.fov * Math.PI) / 360) * scale);
    const mid = topY - visible / 2;
    camera.position.set(0, mid, dist);
    camera.lookAt(0, mid, 0);
    camera.near = dist * 0.3;
    camera.far = dist * 3;
    camera.updateProjectionMatrix();
    if (phase === "settled") restPose();
  }

  // ---- animation state machine --------------------------------------------
  const warmDur = 0.55;
  const feedStep = (D - Oe) / 46;

  function setPhase(p: Phase) {
    phase = p;
    phaseT = 0;
    setHover(hover);
    opts.onPhase?.(p);
  }
  function run() {
    if (phase === "idle") setPhase(reduced ? "clear" : "warm");
    else if (phase === "settled") setPhase("clear");
  }
  function resetCloth(z: number) {
    feed = z;
    flip = 0;
    flipTarget = 0;
    settle = 0;
    frontMat.opacity = backMat.opacity = 1;
    layout();
    for (let i = 0; i < 60; i++) stepCloth(1 / 120);
  }
  function restPose() {
    pose.x = HOME.x;
    pose.z = HOME.z;
    pose.rx = HOME.rx;
    pose.rz = HOME.rz;
    pose.ry = Math.PI;
    pose.y = floorY + (D / 2) * Math.cos(HOME.rx) + 0.004;
    flutter = 0;
    settle = 1;
  }
  function breathe() {
    const k = 0.5 + 0.5 * Math.sin(clock * 2.6);
    barMat.opacity += (0.18 + 0.3 * k - barMat.opacity) * 0.12;
    glow.intensity = barMat.opacity * 0.55;
    ledMat.emissiveIntensity = 0.4 + 1.4 * k;
  }
  function tick(rawDt: number, dt: number) {
    phaseT += rawDt;
    if (phase === "idle") {
      breathe();
      feed = Oe + (reduced ? 0 : 0.008 * Math.sin(clock * 1.6));
    } else if (phase === "warm") {
      barMat.opacity += (1 - barMat.opacity) * Math.min(1, dt * 5);
      ledMat.emissiveIntensity = Math.floor(phaseT * 10) % 2 ? 2.4 : 0.5;
      const s = dt * 6 * smoothstep(0, warmDur, phaseT);
      rollers.forEach((r) => (r.rotation.x -= s));
      if (phaseT >= warmDur) setPhase("feed");
    } else if (phase === "feed") {
      const steps = phaseT * 15;
      const whole = Math.floor(steps);
      const frac = steps - whole;
      const before = feed;
      feed = Math.min(D, Oe + feedStep * (whole + easeInOutCubic(clamp(frac / 0.62, 0, 1))));
      rollers.forEach((r, i) => (r.rotation.x += ((i ? 1 : -1) * (feed - before)) / 0.012));
      printWind = smoothstep(0, 0.6, phaseT) * (1 - smoothstep(46 / 15 - 0.5, 46 / 15, phaseT));
      barMat.opacity += (0.85 + 0.15 * Math.sin(phaseT * 22) - barMat.opacity) * 0.2;
      ledMat.emissiveIntensity = 1.6 + Math.sin(phaseT * 18) * 0.9;
      if (feed >= D - 1e-5) {
        feed = D;
        printWind = 0;
        setPhase("hold");
        opts.onPrinted?.();
      }
    } else if (phase === "hold") {
      barMat.opacity += (0.25 - barMat.opacity) * Math.min(1, dt * 4);
      ledMat.emissiveIntensity = 0.25;
      if (phaseT >= 0.32) {
        held.set(P);
        let sx = 0;
        let sy = 0;
        let sz = 0;
        for (let i = 0; i < verts; i++) {
          sx += P[i * 3];
          sy += P[i * 3 + 1];
          sz += P[i * 3 + 2];
        }
        centroid = { x: sx / verts, y: sy / verts, z: sz / verts };
        feed = D + 10;
        setPhase("fall");
      }
    } else if (phase === "fall") {
      barMat.opacity += (0 - barMat.opacity) * Math.min(1, dt * 3);
      flyPath(phaseT);
      applyPose(easeOutCubic(clamp(phaseT / 0.35, 0, 1)), phaseT);
      if (phaseT >= FALL) {
        restPose();
        setPhase("settled");
      }
    } else if (phase === "settled") {
      breathe();
      flip = reduced ? flipTarget : flip + (flipTarget - flip) * Math.min(1, dt * 5);
      applyPose(1, phaseT);
    } else if (phase === "clear") {
      const t = clamp(phaseT / 0.45, 0, 1);
      frontMat.opacity = backMat.opacity = 1 - t;
      if (t >= 1) {
        if (reduced) {
          restPose();
          applyPose(1, 0);
          opts.onPrinted?.();
          fadeIn = 0;
          setPhase("settled");
        } else {
          resetCloth(0);
          setPhase("warm");
        }
      }
    }
    if (fadeIn < 1) {
      fadeIn = Math.min(1, fadeIn + rawDt / 0.45);
      frontMat.opacity = backMat.opacity = fadeIn;
    }
    // The press button: pops out when the machine is idle or done, presses in
    // (and lights its violet collar) while a job runs.
    const pressed = phase === "warm" || phase === "feed" || phase === "hold" || phase === "fall";
    const invited = !pressed && hover === "printer" ? 0.008 : 0;
    buttonCap.position.z +=
      ((pressed ? -0.03 : invited) - buttonCap.position.z) * Math.min(1, dt * 12);
    buttonRing.material.opacity +=
      ((pressed && !reduced ? 0.9 : 0) - buttonRing.material.opacity) * Math.min(1, dt * 6);
  }

  // ---- machine float + clip sync ------------------------------------------
  function floatMachine(t: number) {
    const on = reduced ? 0 : 1;
    machine.position.set(
      Math.sin(t * 0.5) * 0.025 * on,
      slotY + Math.sin(t * 1.1) * 0.03 * on,
      Math.sin(t * 0.7) * 0.02 * on,
    );
    machine.rotation.set(
      Math.sin(t * 0.6) * 0.03 * on,
      Math.sin(t * 0.4) * 0.05 * on,
      Math.sin(t * 0.9) * 0.018 * on,
    );
    machine.updateMatrixWorld(true);
    machineWorld.copy(machine.matrixWorld);
    clipPlane.setFromNormalAndCoplanarPoint(
      tmpV2.set(0, -1, 0).applyQuaternion(machine.quaternion),
      tmpV.setFromMatrixPosition(machine.matrixWorld),
    );
    uPlane.value.set(clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.constant);
  }

  // ---- pointer: poke the sheet, click to print or flip ---------------------
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();
  function project(e: PointerEvent): THREE.Vector3 | null {
    const rect = canvas.getBoundingClientRect();
    ndc.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndc, camera);
    return raycaster.ray.intersectPlane(planeZ, hit);
  }
  const overSheet = () =>
    raycaster.intersectObject(front).length > 0 || raycaster.intersectObject(back).length > 0;
  const overMachine = () => raycaster.intersectObject(machine, true).length > 0;
  const inside = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return (
      r.width > 0 &&
      e.clientX >= r.left &&
      e.clientX <= r.right &&
      e.clientY >= r.top &&
      e.clientY <= r.bottom
    );
  };
  const targetAt = (e: PointerEvent): "printer" | "sheet" | null => {
    if (!inside(e)) return null;
    if (!project(e)) return null;
    return overMachine() ? "printer" : overSheet() ? "sheet" : null;
  };
  const interactive = (t: "printer" | "sheet" | null) =>
    !!t && (phase === "idle" || phase === "settled");
  function setHover(t: "printer" | "sheet" | null) {
    const on = interactive(t);
    if (on === hoverSet) return;
    hoverSet = on;
    document.documentElement.classList.toggle("cvp-hover", on);
  }

  let downTarget: { x: number; y: number; t: "printer" | "sheet" } | null = null;
  let pressing = false;
  const onMove = (e: PointerEvent) => {
    if (!inside(e)) {
      poke.active = false;
      hover = null;
      setHover(null);
      return;
    }
    const p = project(e);
    if (p) {
      if (poke.active) {
        poke.vx = (p.x - poke.x) * 30;
        poke.vy = (p.y - poke.y) * 30;
      }
      poke.x = p.x;
      poke.y = p.y;
      poke.active = e.pointerType === "mouse";
    }
    hover = targetAt(e);
    setHover(hover);
  };
  const onDown = (e: PointerEvent) => {
    const t = targetAt(e);
    pressing = !!t;
    downTarget = t && interactive(t) ? { x: e.clientX, y: e.clientY, t } : null;
  };
  const onUp = (e: PointerEvent) => {
    if (pressing) setTimeout(() => (pressing = false), 400);
    if (!downTarget) return;
    const d = downTarget;
    downTarget = null;
    if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 10) return;
    if (phase === "idle") run();
    else if (phase === "settled") {
      if (d.t === "sheet") flipTarget = flipTarget ? 0 : 1;
      else run();
    }
  };
  const swallow = (e: MouseEvent) => {
    if (!pressing) return;
    pressing = false;
    e.preventDefault();
    e.stopPropagation();
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("click", swallow, true);

  // ---- main loop ----------------------------------------------------------
  let last = performance.now();
  let acc = 0;
  let running = false;
  let raf = 0;
  const fixed = 1 / 120;
  const clothBusy = () =>
    phase === "idle" || phase === "warm" || phase === "feed" || phase === "hold";

  function loop(now: number) {
    const rawDt = Math.min(0.25, (now - last) / 1000);
    const dt = Math.min(0.05, rawDt);
    last = now;
    clock += rawDt;
    poke.strength += ((poke.active ? 1 : 0) - poke.strength) * Math.min(1, dt * 6);
    poke.vx *= 0.9;
    poke.vy *= 0.9;
    floatMachine(reduced ? 0 : clock);
    tick(rawDt, dt);
    if (clothBusy()) {
      acc += rawDt;
      let guard = 0;
      while (acc >= fixed && guard < 8) {
        stepCloth(fixed);
        acc -= fixed;
        guard++;
      }
      if (guard === 8) acc = 0;
    }
    (sheetGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    sheetGeo.computeVertexNormals();
    sheetGeo.computeBoundingSphere();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  const start = () => {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  // Prime the cloth so it starts taut.
  floatMachine(0);
  layout();
  sheetGeo.computeVertexNormals();
  for (let i = 0; i < 200; i++) {
    stepCloth(fixed);
    if (i % 10 === 0) sheetGeo.computeVertexNormals();
  }
  (sheetGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  sheetGeo.computeVertexNormals();
  resize();

  const io = new IntersectionObserver(
    ([e]) => (e.isIntersecting && !document.hidden ? start() : stop()),
    { threshold: 0.01 },
  );
  io.observe(container);
  const onVis = () => {
    if (document.hidden) stop();
    else {
      const r = container.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) start();
    }
  };
  document.addEventListener("visibilitychange", onVis);
  const ro = new ResizeObserver(() => resize());
  ro.observe(container);

  return {
    print: run,
    resize,
    get phase() {
      return phase;
    },
    destroy() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("click", swallow, true);
      setHover(null);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      [frontMat, backMat, barMat, chromeMat, darkMat, rollerMat, nubMat, ledMat].forEach((m) => m.dispose());
      frontTex.dispose();
      backTex.dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
