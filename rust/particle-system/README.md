# Particle simulation for the website

Browser port of `particle_system_RUST`, using Macroquad 0.4.16. Rust runs as
WebAssembly; Macroquad renders circles through WebGL. The original project is
unchanged. This directory contains the website's copy of its simulation source.

## Rebuild

Install Rust, then install its browser target once:

```sh
rustup target add wasm32-unknown-unknown
```

From the website repository root:

```sh
npm run build:particles
python -m http.server 3001
```

Visit <http://localhost:3001/particles/>. No Vercel login or database is needed.
Click the canvas to focus it. **R** resets the blue particles, **S** fires a red
particle from the left, and **K** fires one from the right. Controls currently
require a keyboard.

The build command uses Cargo.lock and copies both the compiled WASM and the
matching Macroquad JavaScript runtime to `particles/`. Commit both browser assets
when changing the Rust source; hosting serves them as static files, so Rust is
not required on the hosting service. Do not edit the generated runtime directly.

The port replaces `rand::thread_rng` with Macroquad's browser-compatible RNG,
limits initial radii on small screens, caps long frame delays, and removes shots
after they leave the screen. Collision calculations remain in Rust.

Macroquad's loader is distributed under its upstream license; see
`particles/MACROQUAD-LICENSE`.
