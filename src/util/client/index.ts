import { Devfile } from 'custom-types';

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
