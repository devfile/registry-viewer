/**
 * prepends the viewer root
 */
export const apiWrapper = (url: string): string =>
  `${process.env.DEVFILE_VIEWER_ROOT ? process.env.DEVFILE_VIEWER_ROOT : ''}${url}`;
