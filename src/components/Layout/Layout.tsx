import styles from './Layout.module.css';
import { Footer, Meta, Header, Banner } from '@src/components';
import { useEffect } from 'react';
import Router from 'next/router';
import { Page, PageSection } from '@patternfly/react-core';

export const useAnalytics = (): void => {
  useEffect(() => {
    const handleRouteChange = (url: string): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      requestAnimationFrame(() => (window as any).analytics.page(url));
    };
    Router.events.on('routeChangeComplete', handleRouteChange);
    return (): void => Router.events.off('routeChangeComplete', handleRouteChange);
  }, []);
};

export interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Renders a {@link Layout} React component.
 * Adds a layout for all the webpages e.g. the header and background
 * @returns `<Layout><Component {...pageProps} /></Layout>`
 */
export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => (
  <div className={styles.pageContainer}>
    <Header />
    <Banner />
    <Page className={styles.contentWrap}>
      <Meta />
      <PageSection>{children}</PageSection>
    </Page>
    <Footer />
  </div>
);
Layout.displayName = 'Layout';
