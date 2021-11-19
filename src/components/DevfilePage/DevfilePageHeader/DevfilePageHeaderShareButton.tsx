import styles from './DevfilePageHeaderShareButton.module.css';
import type { Devfile, DefaultProps } from 'custom-types';
import link from '@public/images/link.svg';
import { Brand, Button } from '@patternfly/react-core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getUserRegion } from '@src/util/client';
import { useRouter } from 'next/router';
import getConfig from 'next/config';

export interface Origin {
  origin: string;
}

export interface DevfilePageHeaderShareButtonProps extends DefaultProps {
  devfile: Devfile;
}

export const DevfilePageHeaderShareButton: React.FC<DevfilePageHeaderShareButtonProps> = ({
  devfile,
  analytics,
}: DevfilePageHeaderShareButtonProps) => {
  const router = useRouter();

  const onClick = (): void => {
    if (analytics) {
      const region = getUserRegion(router.locale);
      const { publicRuntimeConfig } = getConfig();

      analytics.track(
        'Share Link Button Clicked',
        {
          client: publicRuntimeConfig.segmentClientId,
          devfile: devfile.name,
          url: devfile.registryLink || '',
        },
        {
          context: { ip: '0.0.0.0', location: { country: region } },
          userId: analytics.user().anonymousId(),
        },
      );
    }
  };

  return (
    <Button data-testid="share-link-button" className={styles.button} onClick={onClick}>
      <CopyToClipboard text={devfile.registryLink || ''}>
        <Brand src={link} alt="Link button" className={styles.image} />
      </CopyToClipboard>
    </Button>
  );
};
DevfilePageHeaderShareButton.displayName = 'DevfilePageHeaderShareButton';
