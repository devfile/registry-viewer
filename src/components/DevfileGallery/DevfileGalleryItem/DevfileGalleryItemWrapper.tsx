import { DevfileGalleryItem } from '@src/components';
import { forwardRef } from 'react';

/**
 * Renders a {@link DevfileGalleryItemWrapper} React wrapper component for DevfileTile.
 * Makes the devfile tile clickable
 * @returns `<Link href={href} passHref><DevfileTile devfile={devfile}/></Link>`
 */
export const DevfileGalleryItemWrapper = forwardRef(DevfileGalleryItem);
