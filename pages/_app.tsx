// Patternfly import needs to be first or the css will not be imported
import '@patternfly/react-core/dist/styles/base.css';
import type { PublicRuntimeConfig } from 'custom-types';
import { Layout } from '@src/components';
import { isClient } from '@src/util/client';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { NextPage } from 'next';
import { useEffect } from 'react';
import Analytics from 'analytics-node';

const { publicRuntimeConfig } = getConfig();
const { analyticsWriteKey } = publicRuntimeConfig as PublicRuntimeConfig;

/**
 * Renders the {@link MyApp}
 */
const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  // Client renders page
  useEffect(() => {
    if (isClient() && analyticsWriteKey) {
      const analytics = new Analytics(analyticsWriteKey);

      analytics.page({
        userId: '0',
        name: router.asPath
      });
    }
  }, [router.asPath]);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
