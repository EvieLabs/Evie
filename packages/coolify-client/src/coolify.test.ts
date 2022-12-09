import { describe, expect, test } from "vitest";
import { ParseJwt } from "./";

const ExampleJwt =
	"eyJhcHBsaWNhdGlvbklkIjoiY2xiZW5jaW82MDAwMGxvYWZiaTFjcWJ3OSIsImZxZG4iOm51bGwsIm5hbWUiOiJFdmllIiwidHlwZSI6Im1hbnVhbCIsInB1bGxtZXJnZVJlcXVlc3RJZCI6bnVsbCwiYnVpbGRQYWNrIjoiY29tcG9zZSIsInJlcG9zaXRvcnkiOiJ0ZWFtZXZpZS9ldmllIiwiYnJhbmNoIjoibWFpbiIsInByb2plY3RJZCI6Mzk3MjUwNDcxLCJwb3J0IjozMDAwLCJjb21taXQiOiI4ZDcyYmFlOTAyMGVmZTNjYzc5Nzk1Yzg1NDkyYjgzM2YzOWFiOWRkIiwiaW5zdGFsbENvbW1hbmQiOiJ5YXJuIGluc3RhbGwiLCJidWlsZENvbW1hbmQiOm51bGwsInN0YXJ0Q29tbWFuZCI6Inlhcm4gc3RhcnQiLCJiYXNlRGlyZWN0b3J5IjoiIiwicHVibGlzaERpcmVjdG9yeSI6bnVsbH0=";

describe("Configuration Parsing", () => {
	test("ParseJwt", async () => {
		const config = await ParseJwt(ExampleJwt);

		expect(config.repository).toBe("teamevie/evie");
	});
});
