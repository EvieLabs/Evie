import type { z } from "zod";

/**
 * Gets a string from an environment variable.
 * @param key The environment variable key
 */
export function getString(key: string): string;
export function getString(key: string, nullable: false): string;
export function getString(key: string, nullable: boolean): string | null;
export function getString(key: string, nullable = false): string | null {
	const value = process.env[key];
	if (!value && !nullable) {
		throw new Error(`Environment variable ${key} is not set`);
	}

	return value || null;
}

/**
 * Parses a number from an environment variable.
 * @param key The environment variable key
 */
export function getNumber(key: string): number;
export function getNumber(key: string, nullable: false): number;
export function getNumber(key: string, nullable: boolean): number | null;
export function getNumber(key: string, nullable = false): number | null {
	const value = getString(key, nullable);
	if (value === null) {
		return null;
	}
	const number = Number(value);
	if (Number.isNaN(number)) {
		throw new Error(`Environment variable ${key} is not a number`);
	}
	return number;
}

/**
 * Parses a comma-separated list of values from an environment variable.
 * @param key The environment variable key
 */
export function getArray(key: string): string[];
export function getArray(key: string, nullable: false): string[];
export function getArray(key: string, nullable: boolean): string[] | null;
export function getArray(key: string, nullable = false): string[] | null {
	const value = getString(key, nullable);
	if (value === null) {
		return null;
	}
	return value.split(",");
}

/**
 * Parses JSON from an environment variable.
 * @param key The environment variable key
 */
export function getJson<T>(key: string): T;
export function getJson<T>(key: string, nullable: false): T;
export function getJson<T>(key: string, nullable: boolean): T | null;
export function getJson<S extends z.ZodSchema<any>>(key: string, schema: z.ZodSchema<any>): z.infer<S>;
export function getJson<S extends z.ZodSchema<any>>(key: string, schema: z.ZodSchema<any>, nullable: false): z.infer<S>;
export function getJson<S extends z.ZodSchema<any>>(
	key: string,
	schema: z.ZodSchema<any>,
	nullable: boolean,
): z.infer<S> | null;
export function getJson<T>(key: string, ...args: any[]): T | null {
	const nullable = args[args.length - 1] === true;
	const schema = args.length === 3 ? (args[0] as z.ZodSchema<any>) : undefined;
	const value = getString(key, nullable);
	if (value === null) {
		return null;
	}
	if (schema) {
		return schema.parse(value);
	}
	return JSON.parse(value);
}

/**
 * Gets a boolean from an environment variable.
 * @param key The environment variable key
 * @param defaultValue The default value to use if the environment variable is not defined
 */
export function getBoolean(key: string, defaultValue: boolean): boolean {
	const value = getString(key, true);
	if (value === null) {
		return defaultValue;
	}
	return value === "true";
}
