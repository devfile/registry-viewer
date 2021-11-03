import { Devfile } from 'custom-types';

/**
 * Capitalizes the first letter of a string
 */
export const capitalizeFirstLetter = (value: string): string =>
  value[0].toUpperCase() + value.substring(1);

/**
 * Serializes the devfile page url (Removes any + symbols)
 * $\{devfile.sourceRepo\}+$\{devfile.name\}
 */
export const serializeURL = (devfile: Devfile): string =>
  `${devfile.registry.replace(/\+/g, '')}+${devfile.name.replace(/\+/g, '')}`;

/**
 * Serializes the devfile data-testid (Removes any . and space (' ') symbols)
 */
export const serializeDataTestid = (value: string): string => value.replace(/\.| /g, '');

/**
 * Splits up camel case text
 */
export const splitCamelCase = (value: string): string => value.replace(/([a-z](?=[A-Z]))/g, '$1 ');
