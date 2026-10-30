import { spawnSync } from "node:child_process";
import { copyFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const crate = resolve(root, "rust/particle-system");

function cargo(args, capture = false) {
  const result = spawnSync("cargo", args, {
    cwd: crate,
    encoding: "utf8",
    stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
  return result.stdout;
}

cargo(["build", "--locked", "--release", "--target", "wasm32-unknown-unknown"]);
const metadata = JSON.parse(cargo([
  "metadata", "--offline", "--format-version", "1",
  "--filter-platform", "wasm32-unknown-unknown",
], true));
const macroquad = metadata.packages.find((pkg) => pkg.name === "macroquad");
copyFileSync(
  resolve(metadata.target_directory, "wasm32-unknown-unknown/release/particle-system-web.wasm"),
  resolve(root, "particles/particle-system.wasm"),
);
// Always ship the loader from the same Macroquad version as the compiled engine.
copyFileSync(
  resolve(dirname(macroquad.manifest_path), "js/mq_js_bundle.js"),
  resolve(root, "particles/mq_js_bundle.js"),
);
copyFileSync(
  resolve(dirname(macroquad.manifest_path), "LICENSE-MIT"),
  resolve(root, "particles/MACROQUAD-LICENSE"),
);
console.log("Built particles/particle-system.wasm and its matching WebGL runtime.");
