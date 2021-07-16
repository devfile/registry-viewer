import Meta from '@components/Meta';

import Link from 'next/link';
import {
  Text,
  TextContent,
  Brand,
  Page,
  PageHeader,
  PageHeaderTools,
  PageSection,
  PageSectionVariants
} from '@patternfly/react-core';

import devfileLogo from '../public/images/devfileLogo.svg';

export interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Renders a {@link Layout} React component.
 * Adds a layout for all the webpages e.g. the header and background
 * @returns `<Layout><Component {...pageProps} /></Layout>`
 */
const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  const logoProps = {
    href: '/'
  };

  const Header = (
    <PageHeader
      logo={<Brand src={devfileLogo} alt="Devfile Registry Logo" style={{ height: '100%' }} />}
      logoProps={logoProps}
      headerTools={
        <PageHeaderTools>
          <Link href="/">
            <a data-test-id="go-home-button">
              <TextContent>
                <Text>Devfile Registry</Text>
              </TextContent>
            </a>
          </Link>
        </PageHeaderTools>
      }
    />
  );

  return (
    <Page header={Header}>
      <Meta />
      <PageSection variant={PageSectionVariants.light}>
        <main>{children}</main>
      </PageSection>
    </Page>
  );
};

export default Layout;
