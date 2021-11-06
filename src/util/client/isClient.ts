/**
 * Function that returns whether the code is running client side
 * @returns boolean
 */
export const isClient = (): boolean => typeof window != 'undefined' && !!window.document;
