You are a senior Three.js developer. Build a **simple mini-project**: a flower blooming animation in Three.js.

Project goals:
1) Create a clean, lightweight Three.js scene that shows a flower blooming from bud to full bloom.
2) Focus on animation quality and clarity, not hyper-realistic modeling.
3) Keep the implementation simple and maintainable (avoid overengineering).

Technical requirements:
- Use JavaScript + Three.js (ES modules).
- Use a minimal setup (Vite or plain module setup).
- No heavy external 3D assets unless absolutely necessary.
- Prefer procedural geometry for the flower (e.g., petals from simple geometry + transforms).
- Include:
  - Ground plane
  - Basic lighting (ambient + directional)
  - Camera controls (OrbitControls)
  - Smooth bloom timeline (e.g., bud closed → petals open → slight organic sway)
- Add easing functions for natural motion.
- Add subtle secondary animation (gentle stem/petal movement).
- Keep performance good (target smooth FPS on normal laptop).

Bloom behavior details:
- Start as a closed bud.
- Stem grows slightly first.
- Petals open in stages (inner petals then outer, or vice versa—choose and explain).
- Final state should feel alive (small breathing/sway loop).
- Optional: color transition from darker bud tones to brighter bloom tones.

Code quality requirements:
- Modular code structure (scene setup, flower model, animation controller).
- Use clear variable/function names.
- Add concise comments only where logic is non-obvious.
- Avoid complex abstractions unless truly needed.

Output format:
1) Explain your implementation plan briefly.
2) Provide complete project files and code.
3) Include a short README.md with:
   - Setup/run steps
   - Controls
   - How bloom animation works
   - Where to tweak speed, petal count, and colors

Important constraints:
- Do NOT overcomplicate the flower modeling.
- If a part becomes complex, choose the simplest visually acceptable approach.
- Prioritize delivering a working, understandable bloom animation first, then polish.