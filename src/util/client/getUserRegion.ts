/**
 * The function takes a locale and returns a region
 * @param locale - router.locale from useRouter()
 * @returns the 2 letter region name
 */
export const getUserRegion = (locale: string | undefined): string | undefined => {
  if (typeof locale === 'string') {
    // Match everything after the last occurrence of -
    const region = locale.match(/[^-]*$/);

    return region![0];
  }

  return undefined;
};
