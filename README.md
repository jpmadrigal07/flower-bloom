# Flower Bloom

A procedural flower blooming animation built with Three.js. The flower grows from a tiny bud to full bloom with smooth eased motion, color transitions, and an idle sway loop.

## Setup

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

## Controls

| Action | Input |
|--------|-------|
| Orbit | Click & drag |
| Zoom | Scroll wheel |
| Pan | Right-click drag |
| Replay bloom | Press **R** |

## How the Animation Works

The bloom unfolds over ~7 seconds in overlapping phases:

1. **Stem growth** (0–35%) — the stem rises from the ground with `easeOutQuad`.
2. **Leaves appear** (10–45%) — two small leaves scale up along the stem.
3. **Inner petals open** (25–65%) — 5 petals spring outward with `easeOutBack` (slight overshoot for organic feel).
4. **Outer petals open** (40–90%) — 8 larger petals follow, angularly offset so they interleave with the inner ring.
5. **Center grows** (30–70%) — the golden pistil swells into view.
6. **Color shift** (20–85%) — petals transition from dark bud tones to bright pink/rose.

After full bloom the flower enters an **idle sway** — gentle whole-plant oscillation plus per-petal breathing driven by phase-offset sine waves.

## Customization

All tunables live in `src/flower.js` (`CONFIG`) and `src/animation.js`:

| What | Where | Default |
|------|-------|---------|
| Inner petal count | `CONFIG.innerPetals.count` | 5 |
| Outer petal count | `CONFIG.outerPetals.count` | 8 |
| Petal size | `CONFIG.*.width` / `CONFIG.*.length` | 0.28×0.55 / 0.33×0.7 |
| Bud color | `CONFIG.*.budColor` | dark rose |
| Bloom color | `CONFIG.*.bloomColor` | hot pink / light pink |
| Open angle | `CONFIG.*.openAngle` | π/2.3 / π/1.95 |
| Bloom duration | `BLOOM_DURATION` in `animation.js` | 7 seconds |
| Initial delay | `INITIAL_DELAY` in `animation.js` | 0.8 seconds |
| Stem height | `CONFIG.stem.height` | 2.5 units |
