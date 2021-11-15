/**
 * Takes a locale and returns a region
 *
 * @param locale - router.locale from useRouter()
 *
 * @returns the 2 letter region name
 */
export const getUserRegion = (locale: string | undefined): string | undefined => {
  let region: string | undefined;

  // Match everything after the first occurrence of "-"
  const regex = new RegExp(/-([\s\S]*)$/);

  if (typeof locale === 'string') {
    // .match(regex) returns an array and we want the first match
    region = locale.match(regex)![0];
  }

  // If the locales property is not set try to use the language property
  region = region || navigator.language.match(regex)![0];

  if (typeof region === 'string') {
    // Slice the "-" off the front
    region = region.slice(1);
  }

  return region;
};
