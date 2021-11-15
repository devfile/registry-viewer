// Patternfly import needs to be first or the css will not be imported
import '@patternfly/react-core/dist/styles/base.css';
import { Layout } from '@src/components';
import { getAnalytics, getUserRegion } from '@src/util/client';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useEffect } from 'react';
import getConfig from 'next/config';

/**
 * Renders the {@link MyApp}
 */
const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  // Client renders page
  useEffect(() => {
    const analytics = getAnalytics();
    const region = getUserRegion(router.locale);
    const { publicRuntimeConfig } = getConfig();

    if (analytics) {
      analytics.page({
        userId: publicRuntimeConfig.segmentUserId,
        name: router.asPath,
        context: { ip: '0.0.0.0', location: { country: region } },
      });
    }
  }, [router.asPath, router.locale]);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
