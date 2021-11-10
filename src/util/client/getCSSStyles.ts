import { ColorMap, Color } from 'custom-types';

/**
 * Color array for the transition components
 */
export const colors: ColorMap[] = [
  { name: 'lighter', value: '--pf-global--BackgroundColor--100' },
  { name: 'light', value: '--pf-global--BackgroundColor--200' },
  { name: 'dark', value: '--pf-global--BackgroundColor--dark-200' },
  { name: 'darker', value: '--pf-global--BackgroundColor--dark-100' },
];

/**
 * Get the fill color for the transition components
 * @param fill - the type of color
 * @returns a css fill property for the transition components
 */
export const getFillStyle = (fill: Color): React.CSSProperties => ({
  fill: `var(${colors.find((e) => e.name === fill)!.value})`,
});

/**
 * CSS property to flip along x-axis
 */
export const transformX: React.CSSProperties = { transform: 'scaleX(-1)' };

/**
 * CSS property to flip along y-axis
 */
export const transformY: React.CSSProperties = { transform: 'scaleY(-1)' };

/**
 * Get the transition styles for the transition components
 *
 * @param backgroundColor - the type of color
 * @param flipX - default is no flip on the x axis
 * @param flipY - default is no flip on the y axis
 *
 * @returns the transition styles
 */
export const getTransitionStyles = (
  backgroundColor: Color,
  flipX: boolean,
  flipY: boolean,
): React.CSSProperties => {
  let transitionStyles = {
    backgroundColor: `var(${colors.find((e) => e.name === backgroundColor)!.value})`,
  };

  if (flipX) {
    transitionStyles = { ...transitionStyles, ...transformX };
  }

  if (flipY) {
    transitionStyles = { ...transitionStyles, ...transformY };
  }

  return transitionStyles;
};
