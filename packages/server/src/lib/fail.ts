export function fail(message: string, code?: number): never {
  throw new Error(code ? `${code}: ${message}` : message);
}
