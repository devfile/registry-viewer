import styles from './DevfilePageHeaderShareButton.module.css';
import type { Devfile } from 'custom-types';
import link from '@public/images/link.svg';
import { Brand, Button } from '@patternfly/react-core';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export interface Origin {
  origin: string;
}

export interface DevfilePageHeaderShareButtonProps {
  devfile: Devfile;
}

export const DevfilePageHeaderShareButton: React.FC<DevfilePageHeaderShareButtonProps> = ({
  devfile
}: DevfilePageHeaderShareButtonProps) => (
  <Button data-testid="share-link-button" className={styles.button}>
    <CopyToClipboard text={devfile.registryLink || ''}>
      <Brand src={link} alt="Link button" className={styles.image} />
    </CopyToClipboard>
  </Button>
);
DevfilePageHeaderShareButton.displayName = 'DevfilePageHeaderShareButton';
