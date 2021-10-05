import styles from './DevfilePageHeaderShareButton.module.css';
import link from '@public/images/link.svg';
import { Brand, Button } from '@patternfly/react-core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export interface Origin {
  origin: string;
}

export const DevfilePageHeaderShareButton: React.FC = () => {
  const router = useRouter();
  const [url, setUrl] = useState<string>('');

  const origin = async (): Promise<string> => {
    const res = await fetch('/api/get-absolute-url');
    const url = (await res.json()) as Origin;
    return url.origin;
  };

  useEffect(() => {
    origin().then((absoluteUrl) => {
      setUrl(() => absoluteUrl);
    });
  }, []);

  return (
    <Button data-testid="download-button" className={styles.button} variant="tertiary">
      <CopyToClipboard text={`${url}${router.basePath}${router.asPath}`}>
        <Brand src={link} alt="Link button" className={styles.image} />
      </CopyToClipboard>
    </Button>
  );
};
DevfilePageHeaderShareButton.displayName = 'DevfilePageHeaderShareButton';
