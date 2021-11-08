import type { TypeWithErrorReturn } from 'custom-types';

export function tryCatch<T>(func: () => T): TypeWithErrorReturn<T | null> {
  try {
    const data = func() || null;
    return [data, null];
  } catch (err) {
    // Warning for server-side
    // eslint-disable-next-line no-console
    console.error(err);
    return [null, err as Error];
  }
}

export async function asyncTryCatch<T>(
  func: () => Promise<T>,
): Promise<TypeWithErrorReturn<T | null>> {
  try {
    const data = (await func()) || null;
    return [data, null];
  } catch (err) {
    // Warning for server-side
    // eslint-disable-next-line no-console
    console.error(err);
    return [null, err as Error];
  }
}
