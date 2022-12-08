import { setTimeout } from "timers/promises";

const maxTime = 1000;

export async function waitFor<Result>(predicate: () => Result): Promise<Result> {
	const startTime = Date.now();
	let lastError: unknown;

	while (Date.now() - startTime < maxTime) {
		try {
			return predicate();
		} catch (error) {
			lastError = error;
			await setTimeout(50);
		}
	}

	throw lastError ?? new Error("Timeout");
}
