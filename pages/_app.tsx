// Patternfly import needs to be first or the css will not be imported
import '@patternfly/react-core/dist/styles/base.css';
import type { SegmentEvent } from '@segment/analytics-next';
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
    const region = getUserRegion(router.locale);
    const { publicRuntimeConfig } = getConfig();

    if (analytics) {
      const event: SegmentEvent = {
        type: 'track',
        anonymousId: analytics.user().anonymousId(),
        name: router.asPath,
        context: { ip: '0.0.0.0', location: { country: region } },
        properties: { client: publicRuntimeConfig.segmentClientId },
      };

      analytics.track(event);
    }
  }, [analytics, router.asPath, router.locale]);

  return (
    <Layout>
      <Component {...pageProps} analytics={analytics} />
    </Layout>
  );
};

export default MyApp;
