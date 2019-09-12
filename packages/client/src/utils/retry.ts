/**
 * Retry computations that can throw
 */
export function retry<R>(times: number, f: () => R): R {
  let lastError: any;
  for (let i = 0; i < times; i += 1) {
    try {
      return f();
    } catch (err) {
      lastError = err;
      console.warn('Error while ');
    }
  }
  throw lastError;
}
