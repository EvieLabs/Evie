/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import lodash from "lodash";
import type { CamelCasedPropertiesDeep, SnakeCasedPropertiesDeep } from "type-fest";
const { camelCase, isObject, snakeCase } = lodash;

function convertKeyCaseDeep<Input, Output>(input: Input, convertKey: (key: string) => string): Output {
	if (!isObject(input)) {
		return input as unknown as Output;
	}

	if (Array.isArray(input)) {
		return input.map((item) => convertKeyCaseDeep(item, convertKey)) as unknown as Output;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const output: any = {};
	for (const [key, value] of Object.entries(input)) {
		output[convertKey(key)] = convertKeyCaseDeep(value, convertKey);
	}
	return output;
}

export function camelCaseDeep<T>(input: T): CamelCasedPropertiesDeep<T> {
	return convertKeyCaseDeep(input, camelCase);
}

export function snakeCaseDeep<T>(input: T): SnakeCasedPropertiesDeep<T> {
	return convertKeyCaseDeep(input, snakeCase);
}
