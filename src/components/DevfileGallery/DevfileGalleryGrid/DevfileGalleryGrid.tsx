import styles from './DevfileGalleryGrid.module.css';
import type { Devfile, FilterElem } from 'custom-types';
import { DevfileGalleryItemWrapper as DevfileGalleryItem } from '@src/components';
import Link from 'next/link';
import { Gallery } from '@patternfly/react-core';

export interface DevfileGalleryGridProps {
  devfiles: Devfile[];
  sourceRepos: FilterElem[];
}

/**
 * Renders a {@link DevfileGalleryGrid} React component.
 * Adds a grid containing DevfileTiles
 * @returns `<DevfileGrid devfiles={devfiles} \>`
 */
export const DevfileGalleryGrid: React.FC<DevfileGalleryGridProps> = ({
  devfiles,
  sourceRepos
}: DevfileGalleryGridProps) => (
  <Gallery className={styles.devfileGalleryGrid}>
    {devfiles.map((devfile) => (
      <Link
        key={`${devfile.sourceRepo}+${devfile.name}`}
        href={`/devfiles/${devfile.sourceRepo.replace(/\+/g, '')}+${devfile.name.replace(
          /\+/g,
          ''
        )}`}
        passHref
      >
        <DevfileGalleryItem devfile={devfile} sourceRepos={sourceRepos} />
      </Link>
    ))}
  </Gallery>
);
DevfileGalleryGrid.displayName = 'DevfileGalleryGrid';
