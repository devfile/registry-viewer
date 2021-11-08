import styles from './DevfilePageHeaderShareButton.module.css';
import type { Devfile, DefaultProps } from 'custom-types';
import link from '@public/images/link.svg';
import { Brand, Button } from '@patternfly/react-core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getAnalytics } from '@src/util/client';

export interface Origin {
  origin: string;
}

export interface DevfilePageHeaderShareButtonProps extends DefaultProps {
  devfile: Devfile;
}

export const DevfilePageHeaderShareButton: React.FC<DevfilePageHeaderShareButtonProps> = ({
  devfile,
}: DevfilePageHeaderShareButtonProps) => {
  const analytics = getAnalytics();

  const onClick = (): void => {
    if (analytics) {
      analytics.track({
        userId: '0',
        event: 'Share Link Button Clicked',
        properties: {
          devfile: devfile.name,
          url: devfile.registryLink || '',
        },
      });
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
