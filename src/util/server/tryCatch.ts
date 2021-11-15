/* Enables server logging */
/* eslint-disable no-console */
import type { TypeWithErrorReturn } from 'custom-types';

/**
 * A try catch wrapper for a function that replicates the try catch of Go
 *
 * @param func - the function to wrap
 *
 * @returns an array (tuple) with the result as the first element and the potential error as the second element
 */
export function tryCatch<T>(func: () => T): TypeWithErrorReturn<T | null> {
  try {
    const data = func() || null;
    return [data, null];
  } catch (err) {
    console.error(err);
    return [null, err as Error];
  }
}

/**
 * An async try catch wrapper for a function that replicates the try catch of Go
 *
 * @param func - the async function to wrap
 *
 * @returns an array (tuple) with the result as the first element and the potential error as the second element
 */
export async function asyncTryCatch<T>(
  func: () => Promise<T>,
): Promise<TypeWithErrorReturn<T | null>> {
  try {
    const data = (await func()) || null;
    return [data, null];
  } catch (err) {
    console.error(err);
    return [null, err as Error];
  }
}
