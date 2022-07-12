import { join } from "path";
import { getRootData } from "@sapphire/pieces";

export const mainFolder = getRootData().root;
export const rootFolder = join(mainFolder, "..");
