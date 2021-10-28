import styles from './DevfilePageHeaderShareButton.module.css';
import type { Devfile } from 'custom-types';
import link from '@public/images/link.svg';
import { apiWrapper } from '@src/util/client';
import { Brand, Button } from '@patternfly/react-core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState, useEffect } from 'react';

export interface Origin {
  origin: string;
}

export interface DevfilePageHeaderShareButtonProps {
  devfile: Devfile;
}

export const DevfilePageHeaderShareButton: React.FC<DevfilePageHeaderShareButtonProps> = ({
  devfile
}: DevfilePageHeaderShareButtonProps) => {
  const [url, setUrl] = useState<string>('');

  const origin = async (): Promise<string> => {
    const res = await fetch(apiWrapper('/api/get-remote-registry'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceRepo: devfile.sourceRepo })
    });

    if (res.status !== 200) {
      return '';
    }

    const url = (await res.json()) as Origin;
    return url.origin;
  };

  useEffect(() => {
    origin().then((hostUrl) => {
      if (hostUrl) {
        setUrl(() => `${hostUrl}/devfiles/${devfile.name}`);
      }
    });
  }, []);

  return (
    <Button data-testid="share-link-button" className={styles.button}>
      <CopyToClipboard text={url}>
        <Brand src={link} alt="Link button" className={styles.image} />
      </CopyToClipboard>
    </Button>
  );
};
DevfilePageHeaderShareButton.displayName = 'DevfilePageHeaderShareButton';
