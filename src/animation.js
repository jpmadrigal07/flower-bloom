import * as THREE from 'three';
import { CONFIG } from './flower.js';

function easeOutQuad(t) {
  return t * (2 - t);
}

function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutBack(t) {
  const c = 1.7;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
}

function remap(v, lo, hi) {
  return Math.max(0, Math.min(1, (v - lo) / (hi - lo)));
}

export const BLOOM_DURATION = 7;
export const INITIAL_DELAY = 0.8;

const PHASE = {
  stem:   [0.00, 0.35],
  leaf:   [0.10, 0.45],
  center: [0.30, 0.70],
  inner:  [0.25, 0.65],
  outer:  [0.40, 0.90],
  color:  [0.20, 0.85],
};

export function createBloomController(flower) {
  let time = 0;
  let progress = 0;
  let bloomed = false;

  const budInner = CONFIG.innerPetals.budColor.clone();
  const bloomInner = CONFIG.innerPetals.bloomColor.clone();
  const budOuter = CONFIG.outerPetals.budColor.clone();
  const bloomOuter = CONFIG.outerPetals.bloomColor.clone();

  function update(dt) {
    time += dt;
    if (time - INITIAL_DELAY < 0) return;

    if (!bloomed) {
      progress = Math.min(1, progress + dt / BLOOM_DURATION);
      if (progress >= 1) bloomed = true;
    }

    // --- Stem ---
    const stemT = easeOutQuad(remap(progress, ...PHASE.stem));
    flower.stem.scale.y = THREE.MathUtils.lerp(0.001, 1, stemT);
    const stemH = flower.stem.scale.y * CONFIG.stem.height;
    flower.head.position.y = stemH;

    // --- Leaves ---
    const leafT = easeOutQuad(remap(progress, ...PHASE.leaf));
    flower.leaves.forEach(lf => {
      lf.position.y = lf.userData.heightFraction * stemH;
      const s = THREE.MathUtils.lerp(0.001, lf.userData.targetScale, leafT);
      lf.scale.setScalar(s);
    });

    // --- Center pistil ---
    const cT = easeInOutCubic(remap(progress, ...PHASE.center));
    const cs = THREE.MathUtils.lerp(0.001, 1, cT);
    flower.center.scale.set(cs, cs * 0.75, cs);

    // --- Inner petals ---
    const iT = easeOutBack(remap(progress, ...PHASE.inner));
    flower.innerPetals.forEach(p => {
      p.opener.rotation.x = iT * CONFIG.innerPetals.openAngle;
    });

    // --- Outer petals ---
    const oT = easeOutBack(remap(progress, ...PHASE.outer));
    flower.outerPetals.forEach(p => {
      p.opener.rotation.x = oT * CONFIG.outerPetals.openAngle;
    });

    // --- Color transition ---
    const colT = easeInOutCubic(remap(progress, ...PHASE.color));
    flower.innerMat.color.copy(budInner).lerp(bloomInner, colT);
    flower.outerMat.color.copy(budOuter).lerp(bloomOuter, colT);

    if (bloomed) idleSway(time);
  }

  function idleSway(t) {
    flower.group.rotation.z = Math.sin(t * 0.7) * 0.025;
    flower.group.rotation.x = Math.sin(t * 0.5 + 1.0) * 0.018;

    flower.innerPetals.forEach((p, i) => {
      const phase = (i / CONFIG.innerPetals.count) * Math.PI * 2;
      p.opener.rotation.x =
        CONFIG.innerPetals.openAngle + Math.sin(t * 1.2 + phase) * 0.04;
    });

    flower.outerPetals.forEach((p, i) => {
      const phase = (i / CONFIG.outerPetals.count) * Math.PI * 2;
      p.opener.rotation.x =
        CONFIG.outerPetals.openAngle + Math.sin(t * 0.9 + phase) * 0.03;
    });
  }

  function reset() {
    time = 0;
    progress = 0;
    bloomed = false;

    flower.group.rotation.set(0, 0, 0);
    flower.stem.scale.y = 0.001;
    flower.head.position.y = 0;
    flower.center.scale.set(0.001, 0.001, 0.001);
    flower.innerMat.color.copy(budInner);
    flower.outerMat.color.copy(budOuter);
    flower.innerPetals.forEach(p => { p.opener.rotation.x = 0; });
    flower.outerPetals.forEach(p => { p.opener.rotation.x = 0; });
    flower.leaves.forEach(lf => {
      lf.scale.setScalar(0.001);
      lf.position.y = 0;
    });
  }

  return { update, reset };
}
