import type { HomeGalleryItemProps } from '@src/components';
import { HomeGalleryItem } from '@src/components';
import { forwardRef } from 'react';

/**
 * Renders a {@link HomeGalleryItemWrapper} React wrapper component for DevfileTile.
 * Makes the devfile tile clickable
 * @returns `<Link href={href} passHref><DevfileTile devfile={devfile}/></Link>`
 */
export const HomeGalleryItemWrapper: React.ForwardRefExoticComponent<HomeGalleryItemProps> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  forwardRef((props, ref) => <HomeGalleryItem {...props} />);
