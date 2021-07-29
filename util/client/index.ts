/**
 * Capitalizes the first letter of a string
 */
export const capitalizeFirstLetter = (value: string): string =>
  value[0].toUpperCase() + value.slice(1);
