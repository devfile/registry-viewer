import styles from './HomeGalleryGrid.module.css';
import type { Devfile, FilterElem, DefaultProps } from 'custom-types';
import { HomeGalleryItemWrapper as HomeGalleryItem } from '@src/components';
import { serializeURL } from '@src/util/client';
import Link from 'next/link';
import { Gallery } from '@patternfly/react-core';

export interface HomeGalleryGridProps extends DefaultProps {
  devfiles: Devfile[];
  registries: FilterElem[];
  providers: FilterElem[];
}

/**
 * Renders a {@link HomeGalleryGrid} React component.
 * Adds a grid containing DevfileTiles
 * @returns `<DevfileGrid devfiles={devfiles} \>`
 */
export const HomeGalleryGrid: React.FC<HomeGalleryGridProps> = ({
  devfiles,
  registries,
  providers,
}: HomeGalleryGridProps) => (
  <Gallery className={styles.devfileGalleryGrid}>
    {devfiles.map((devfile) => (
      <Link key={serializeURL(devfile)} href={`/devfiles/${serializeURL(devfile)}`} passHref>
        <HomeGalleryItem devfile={devfile} registries={registries} providers={providers} />
      </Link>
    ))}
  </Gallery>
);
HomeGalleryGrid.displayName = 'HomeGalleryGrid';
