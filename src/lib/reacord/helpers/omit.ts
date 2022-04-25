export function omit<Subject extends object, Key extends PropertyKey>(
  subject: Subject,
  keys: Key[]
  // hack: using a conditional type preserves union types
): Subject extends unknown ? Omit<Subject, Key> : never {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = {};
  for (const key in subject) {
    if (!keys.includes(key as unknown as Key)) {
      result[key] = subject[key];
    }
  }
  return result;
}
