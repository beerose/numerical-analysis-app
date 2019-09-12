export function isNumberOrNumberString(x: unknown): boolean {
  return x != null && !Number.isNaN(Number(x));
}
