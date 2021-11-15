import { Devfile } from 'custom-types';

/**
 * Capitalizes the first letter of a string
 *
 * @param value - string to capitalize
 *
 * @returns capitalized string
 */
export const capitalizeFirstLetter = (value: string): string =>
  value[0].toUpperCase() + value.substring(1);

/**
 * Serializes the devfile page url (Removes any + symbols)
 * e.g. $\{devfile.sourceRepo\}+$\{devfile.name\}
 *
 * @param devfile - devfile to serialize
 *
 * @returns devfile page url
 */
export const serializeURL = (devfile: Devfile): string =>
  `${devfile.registry.replace(/\+/g, '')}+${devfile.name.replace(/\+/g, '')}`;

/**
 * Serializes the devfile data-testid
 * Removes any . and space symbols
 *
 * @param value - data-testid value to serialize
 * @returns serialized data-testid
 */
export const serializeDataTestid = (value: string): string => value.replace(/\.| /g, '');

/**
 * Splits up camel case text
 *
 * @param value - string to split up
 *
 * @returns a split up camel case string
 */
export const splitCamelCase = (value: string): string => value.replace(/([a-z](?=[A-Z]))/g, '$1 ');
