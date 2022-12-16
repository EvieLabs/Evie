import { createAppTsupConfig } from "../../tsup.config.js";

export default createAppTsupConfig({
	entry: ["src/**/*.ts", "!src/**/*.d.ts", "src/**/*.tsx"],
	format: ["esm"],
	tsconfig: "src/tsconfig.json",
});
