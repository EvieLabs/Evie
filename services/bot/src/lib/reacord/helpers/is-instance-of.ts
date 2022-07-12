/**
 * for narrowing instance types with array.filter
 */
export const isInstanceOf =
	<T>(Constructor: new (...args: unknown[]) => T) =>
	(value: unknown): value is T =>
		value instanceof Constructor;
