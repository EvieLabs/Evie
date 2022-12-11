import { describe, expect, test } from "vitest";
import { Environment } from ".";

const FakeEnv = {
	EXAMPLE_JSON: JSON.stringify({
		hello: "world",
	}),
	EXAMPLE_ARRAY: "hello,world",
	EXAMPLE_NUMBER: "123",
	EXAMPLE_STRING: "hello world",
	EXAMPLE_BOOLEAN: "false",
};

process.env = FakeEnv;

describe("Env Getters", () => {
	test("getString", () => {
		expect(Environment.getString("EXAMPLE_STRING")).toBe("hello world");
	});

	test("getNumber", () => {
		expect(Environment.getNumber("EXAMPLE_NUMBER")).toBe(123);
	});

	test("getArray", () => {
		expect(Environment.getArray("EXAMPLE_ARRAY")).toEqual(["hello", "world"]);
	});

	test("getJson", () => {
		expect(Environment.getJson("EXAMPLE_JSON")).toEqual({
			hello: "world",
		});
	});

	test("getBoolean", () => {
		expect(Environment.getBoolean("EXAMPLE_BOOLEAN", true)).toBe(false);
	});
});
