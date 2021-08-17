import type { Devfile } from 'custom-types';
import { DevfileGalleryItemWrapper as DevfileGalleryItem } from '@src/components';
import Link from 'next/link';
import { Gallery } from '@patternfly/react-core';

export interface DevfileGalleryGridProps {
  devfiles: Devfile[];
}

/**
 * Renders a {@link DevfileGalleryGrid} React component.
 * Adds a grid containing DevfileTiles
 * @returns `<DevfileGrid devfiles={devfiles} \>`
 */
export const DevfileGalleryGrid: React.FC<DevfileGalleryGridProps> = ({
  devfiles
}: DevfileGalleryGridProps) => (
  <Gallery style={{ paddingTop: '1rem' }}>
    {devfiles.map((devfile) => (
      <Link
        key={`${devfile.sourceRepo}+${devfile.name}`}
        href={`/devfiles/${devfile.sourceRepo.replace(/\+/g, '')}+${devfile.name.replace(
          /\+/g,
          ''
        )}`}
        passHref
      >
        <DevfileGalleryItem devfile={devfile} />
      </Link>
    ))}
  </Gallery>
);
DevfileGalleryGrid.displayName = 'DevfileGalleryGrid';
