import styles from './DevfilePageHeaderShareButton.module.css';
import shareButton from '@public/images/share.svg';
import { Brand } from '@patternfly/react-core';
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
    <CopyToClipboard text={`${url}${router.basePath}${router.asPath}`}>
      <Brand src={shareButton} alt="Share button" className={styles.image} />
    </CopyToClipboard>
  );
};
DevfilePageHeaderShareButton.displayName = 'DevfilePageHeaderShareButton';
