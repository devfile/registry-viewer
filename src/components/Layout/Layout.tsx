import styles from './Layout.module.css';
import { Footer, Meta, Header, Banner } from '@src/components';
import { Page, PageSection, PageSectionVariants } from '@patternfly/react-core';
import { useRouter } from 'next/router';

export interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Renders a {@link Layout} React component.
 * Adds a layout for all the webpages e.g. the header and background
 * @returns `<Layout><Component {...pageProps} /></Layout>`
 */
export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  const router = useRouter();
  return (
    <div className={styles.pageContainer}>
      <Header />
      {router.asPath === '/' && <Banner />}
      <Page header={Header} className={styles.contentWrap}>
        <Meta />
        <PageSection variant={PageSectionVariants.light}>{children}</PageSection>
      </Page>
      <Footer />
    </div>
  );
};
Layout.displayName = 'Layout';
