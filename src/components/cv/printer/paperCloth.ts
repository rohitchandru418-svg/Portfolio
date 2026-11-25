import * as THREE from "three";

/**
 * A verlet cloth solver for the sheet of paper.
 *
 * Paper reads as paper because it *behaves* like paper: it drapes, it holds a
 * slight curl, and its free edge waves. A rigid plane cannot do that, so the
 * sheet is simulated as a pinned cloth — the top edge is held at the slot and
 * the rest hangs under gravity with a little wind.
 *
 * Structural, shear and bend constraints keep it from stretching; the bend
 * constraints are the ones that stop it folding like fabric.
 */

export const COLS = 23;
export const ROWS = 33;
export const SHEET_W = 1;
export const SHEET_H = Math.SQRT2;

const DAMPING = 0.972;
const GRAVITY = 9.8;
const WIND = 0.9;

type Constraint = { a: number; b: number; len: number; k: number };

export class PaperCloth {
  readonly geometry: THREE.PlaneGeometry;
  private readonly pos: Float32Array;
  private readonly prev: Float32Array;
  private readonly rest: Float32Array;
  private readonly pinned: Uint8Array;
  private readonly constraints: Constraint[] = [];
  private readonly idx = (r: number, c: number) => r * COLS + c;

  constructor() {
    this.geometry = new THREE.PlaneGeometry(SHEET_W, SHEET_H, COLS - 1, ROWS - 1);
    const attr = this.geometry.attributes.position as THREE.BufferAttribute;
    this.pos = attr.array as Float32Array;
    this.prev = new Float32Array(this.pos);
    this.rest = new Float32Array(this.pos);
    this.pinned = new Uint8Array(COLS * ROWS);

    for (let c = 0; c < COLS; c++) this.pinned[this.idx(0, c)] = 1;

    const add = (a: number, b: number, k: number) => {
      const dx = this.rest[a * 3] - this.rest[b * 3];
      const dy = this.rest[a * 3 + 1] - this.rest[b * 3 + 1];
      this.constraints.push({ a, b, len: Math.hypot(dx, dy), k });
    };

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = this.idx(r, c);
        if (c < COLS - 1) add(i, this.idx(r, c + 1), 1);
        if (r < ROWS - 1) add(i, this.idx(r + 1, c), 1);
        if (r < ROWS - 1 && c < COLS - 1) {
          add(i, this.idx(r + 1, c + 1), 0.9);
          add(this.idx(r, c + 1), this.idx(r + 1, c), 0.9);
        }
        if (c < COLS - 2) add(i, this.idx(r, c + 2), 0.55);
        if (r < ROWS - 2) add(i, this.idx(r + 2, c), 0.45);
      }
    }

    this.settle(24);
  }

  /** Run the solver forward without drawing, so the sheet starts taut. */
  settle(steps: number) {
    for (let i = 0; i < steps; i++) this.step(1 / 60, 0, 0);
  }

  step(dt: number, elapsed: number, energy: number) {
    const { pos, prev, rest, pinned, constraints } = this;
    const dt2 = dt * dt;

    for (let v = 0; v < pinned.length; v++) {
      const i = v * 3;
      if (pinned[v]) {
        // The pinned edge simply rides with the mesh.
        pos[i] = rest[i];
        pos[i + 1] = rest[i + 1];
        pos[i + 2] = rest[i + 2];
        prev[i] = rest[i];
        prev[i + 1] = rest[i + 1];
        prev[i + 2] = rest[i + 2];
        continue;
      }
      const x = pos[i], y = pos[i + 1], z = pos[i + 2];
      const vx = (x - prev[i]) * DAMPING;
      const vy = (y - prev[i + 1]) * DAMPING;
      const vz = (z - prev[i + 2]) * DAMPING;

      // Wind: a slow standing wave across the sheet, out of plane, so the
      // free edge drifts rather than flapping.
      const w =
        WIND * energy * (0.5 + 0.5 * Math.sin(elapsed * 1.1 + x * 2.3 + y * 0.7));
      const wz = w * (0.35 * Math.cos(elapsed * 0.8 + y * 1.9));

      prev[i] = x;
      prev[i + 1] = y;
      prev[i + 2] = z;
      pos[i] = x + vx;
      pos[i + 1] = y + vy - GRAVITY * dt2;
      pos[i + 2] = z + vz + wz * dt2;
    }

    const iters = 8;
    for (let it = 0; it < iters; it++) {
      for (let ci = 0; ci < constraints.length; ci++) {
        const { a, b, len, k } = constraints[ci];
        const ai = a * 3, bi = b * 3;
        const dx = pos[bi] - pos[ai];
        const dy = pos[bi + 1] - pos[ai + 1];
        const dz = pos[bi + 2] - pos[ai + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
        const diff = ((d - len) / d) * k * 0.5;
        const pa = pinned[a] ? 0 : 1;
        const pb = pinned[b] ? 0 : 1;
        const wsum = pa + pb || 1;
        const fa = pa / wsum, fb = pb / wsum;
        pos[ai] += dx * diff * fa * 2;
        pos[ai + 1] += dy * diff * fa * 2;
        pos[ai + 2] += dz * diff * fa * 2;
        pos[bi] -= dx * diff * fb * 2;
        pos[bi + 1] -= dy * diff * fb * 2;
        pos[bi + 2] -= dz * diff * fb * 2;
      }
    }

    (this.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    this.geometry.computeVertexNormals();
  }

  dispose() {
    this.geometry.dispose();
  }
}
