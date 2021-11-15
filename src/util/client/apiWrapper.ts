/**
 * Prepends the viewer root if applicable
 *
 * @param url - the api url
 *
 * @returns the correct api path
 */
export const apiWrapper = (url: string): string =>
  `${process.env.DEVFILE_VIEWER_ROOT ? process.env.DEVFILE_VIEWER_ROOT : ''}${url}`;
