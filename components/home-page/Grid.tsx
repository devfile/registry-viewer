import type { Devfile } from 'custom-types';

import DevfileTile from '@components/home-page/Tile';

import Link from 'next/link';
import { Gallery } from '@patternfly/react-core';

export interface DevfileGridProps {
  devfiles: Devfile[];
}

/**
 * Renders a {@link DevfileGrid} React component.
 * Adds a grid containing DevfileTiles
 * @returns `<DevfileGrid devfiles={devfiles} \>`
 */
const DevfileGrid: React.FC<DevfileGridProps> = ({ devfiles }: DevfileGridProps) => (
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
        <DevfileTile devfile={devfile} />
      </Link>
    ))}
  </Gallery>
);

export default DevfileGrid;
