/* global load, wasm_exports, gl */
const particleCanvas = document.getElementById("glcanvas");
const particleStatus = document.getElementById("particle-status");

particleCanvas.addEventListener("pointerdown", () => particleCanvas.focus());

async function startParticles() {
  try {
    if (typeof load !== "function") {
      throw new Error("The WebGL runtime could not be loaded.");
    }
    // Validate the build before handing it to Macroquad's loader.
    const response = await fetch("./particle-system.wasm");
    if (!response.ok) {
      throw new Error("The WASM build is missing. Run npm run build:particles.");
    }
    const wasm = await response.arrayBuffer();
    if (!WebAssembly.validate(wasm)) {
      throw new Error("The particle simulation WASM file is invalid.");
    }
    // Macroquad's loader starts asynchronously but does not return a promise.
    load("./particle-system.wasm");
    await new Promise((resolve, reject) => {
      const deadline = performance.now() + 15000;
      function checkStarted() {
        if (typeof wasm_exports !== "undefined" && typeof gl !== "undefined" && gl) {
          resolve();
        } else if (performance.now() > deadline) {
          reject(new Error("WebGL could not start. Check your browser's graphics support and console."));
        } else {
          requestAnimationFrame(checkStarted);
        }
      }
      checkStarted();
    });
    particleStatus.hidden = true;
    particleCanvas.focus();
  } catch (error) {
    particleStatus.textContent = `Unable to start particles: ${error.message}`;
  }
}

startParticles();
