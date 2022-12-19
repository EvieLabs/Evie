import { createAppTsupConfig } from "../../tsup.config.js";

export default createAppTsupConfig({
	entry: ["src/**/*.ts"],
	format: ["esm"],
});
