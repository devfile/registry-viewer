import styles from './Layout.module.css';
import type { DefaultProps } from 'custom-types';
import { Footer, Meta, Header, Banner } from '@src/components';
import { Page, PageSection } from '@patternfly/react-core';

export interface LayoutProps extends DefaultProps {
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
