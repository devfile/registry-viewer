import { Devfile, ColorMap, Color } from 'custom-types';

/**
 * Capitalizes the first letter of a string
 */
export const capitalizeFirstLetter = (value: string): string =>
  value[0].toUpperCase() + value.slice(1);

/**
 * Serializes the devfile page url (Removes any + symbols)
 * $\{devfile.sourceRepo\}+$\{devfile.name\}
 */
export const serializeURL = (devfile: Devfile): string =>
  `${devfile.sourceRepo.replace(/\+/g, '')}+${devfile.name.replace(/\+/g, '')}`;

/**
 * Color array for the transition components
 */
export const colors: ColorMap[] = [
  { name: 'lighter', value: '--pf-global--BackgroundColor--100' },
  { name: 'light', value: '--pf-global--BackgroundColor--200' },
  { name: 'dark', value: '--pf-global--BackgroundColor--dark-200' },
  { name: 'darker', value: '--pf-global--BackgroundColor--dark-100' }
];

/**
 * Get the fill color for the transition components
 */
export const getFillStyle = (fill: Color): React.CSSProperties => ({
  fill: `var(${colors.find((e) => e.name === fill)!.value})`
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
 */
export const getTransitionStyles = (
  backgroundColor: Color,
  flipX: boolean,
  flipY: boolean
): React.CSSProperties => {
  let transitionStyles = {
    backgroundColor: `var(${colors.find((e) => e.name === backgroundColor)!.value})`
  };

  if (flipX) {
    transitionStyles = { ...transitionStyles, ...transformX };
  }

  if (flipY) {
    transitionStyles = { ...transitionStyles, ...transformY };
  }

  return transitionStyles;
};
