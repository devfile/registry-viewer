// Patternfly import needs to be first or the css will not be imported
import '@patternfly/react-core/dist/styles/base.css';
import { Layout } from '@src/components';
import { getUserRegion, useAnalytics } from '@src/util/client';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import getConfig from 'next/config';
import { useEffect } from 'react';

/**
 * Renders the {@link MyApp}
 */
const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const analytics = useAnalytics();

  // Client renders page
  useEffect(() => {
    if (analytics) {
      const region = getUserRegion(router.locale);
      const { publicRuntimeConfig } = getConfig();
      const anonymousId = analytics.user().anonymousId();
      analytics.identify(
        anonymousId,
        {
          id: anonymousId,
        },
        {
          context: { ip: '0.0.0.0', location: { country: region } },
        },
      );

      analytics.track(
        router.asPath,
        { client: publicRuntimeConfig.segmentClientId },
        {
          context: { ip: '0.0.0.0', location: { country: region } },
          userId: anonymousId,
        },
      );
    }
  }, [analytics, router.asPath, router.locale]);

  return (
    <Layout>
      <Component {...pageProps} analytics={analytics} />
    </Layout>
  );
};

export default MyApp;
