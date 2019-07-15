export function isNumberOrNumberString(x: unknown): boolean {
  return !Number.isNaN(Number(x));
}
