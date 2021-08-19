import { Devfile } from 'custom-types';

/**
 * Capitalizes the first letter of a string
 */
export const capitalizeFirstLetter = (value: string): string =>
  value[0].toUpperCase() + value.slice(1);

export const serializeURL = (devfile: Devfile): string =>
  `${devfile.sourceRepo.replace(/\+/g, '')}+${devfile.name.replace(/\+/g, '')}`;
