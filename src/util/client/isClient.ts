/**
 * Tells code is running client side
 *
 * @returns true if code is running client side
 */
export const isClient = (): boolean => typeof window != 'undefined' && !!window.document;
