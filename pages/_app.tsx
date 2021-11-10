// Patternfly import needs to be first or the css will not be imported
import '@patternfly/react-core/dist/styles/base.css';
import { Layout } from '@src/components';
import { getAnalytics, getUserRegion } from '@src/util/client';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useEffect } from 'react';

/**
 * Renders the {@link MyApp}
 */
const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  // Client renders page
  useEffect(() => {
    const analytics = getAnalytics();
    const location = getUserRegion(router.locale);

    if (analytics) {
      analytics.page({
        userId: 'registry-viewer',
        name: router.asPath,
        context: { ip: '0.0.0.0', locale: router.locale, location },
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
