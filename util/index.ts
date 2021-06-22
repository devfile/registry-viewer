/**
 * String that contains localhost or FQDN
 */
export const server: string = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://REPLACEME.com'

/**
 * Capitalizes the first letter of a string
 */
export const capitalizeFirstLetter = (value: string): string => {
  return value[0].toUpperCase() + value.slice(1)
}
