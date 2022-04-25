import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: false,
  entry: ["src/**/*.ts", "!src/**/*.d.ts", "src/**/*.tsx"],
  minify: false,
  tsconfig: "src/tsconfig.json",
  bundle: false,
  shims: false,
  keepNames: true,
  splitting: false,
});
