import type { LayoutText } from 'custom-types';
import { apiWrapper } from '@src/util/client';

export interface GetLayoutText {
  layoutText: LayoutText;
}

/**
 * Queries for the layout text
 *
 * @returns a layoutText object
 */
export const getLayoutText = async (): Promise<LayoutText> => {
  const res = await fetch(apiWrapper('/api/get-layout-text'));
  const { layoutText } = (await res.json()) as GetLayoutText;
  return layoutText;
};
