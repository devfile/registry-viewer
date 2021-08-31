import type { TryCatch } from 'custom-types';

export function tryCatch<T>(func: () => T): TryCatch<T> {
  try {
    const data = func() || null;
    return [data, null];
  } catch (err) {
    // Warning for server-side
    // eslint-disable-next-line no-console
    console.error(err);
    return [null, err];
  }
}

export async function asyncTryCatch<T>(func: () => Promise<T>): Promise<TryCatch<T>> {
  try {
    const data = (await func()) || null;
    return [data, null];
  } catch (err) {
    // Warning for server-side
    // eslint-disable-next-line no-console
    console.error(err);
    return [null, err];
  }
}
