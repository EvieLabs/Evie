// @ts-check
// Run this with node to generate a key for secure sessions.
// Make sure to run `npx @fastify/secure-session` then `npx @fastify/secure-session > secret-key` before running this.
// The cookie key will then be console logged, make sure to copy it and set it in you .env as COOKIE_KEY

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const keyBuffer = readFileSync(join(__dirname, "secret-key"));
const hexString = keyBuffer.toString("hex");

console.log(hexString);
