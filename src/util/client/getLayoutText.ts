import type { LayoutText } from 'custom-types';

export interface GetLayoutText {
  layoutText: LayoutText;
}

/**
 * Function that queries for the layout text
 * @returns a layoutText object
 */
export const getLayoutText = async (): Promise<LayoutText> => {
  const res = await fetch('/api/get-layout-text');
  const { layoutText } = (await res.json()) as GetLayoutText;
  return layoutText;
};
