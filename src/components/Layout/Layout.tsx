import styles from './Layout.module.css';
import { Meta } from '@src/components';
import devfileLogo from '@public/images/devfileLogo.svg';
import {
  Nav,
  NavItem,
  NavList,
  Text,
  TextContent,
  TextVariants,
  Brand,
  Page,
  PageHeader,
  PageSection,
  PageSectionVariants
} from '@patternfly/react-core';
import Link from 'next/link';

export interface LayoutProps {
  children: React.ReactNode;
}

const navLinks = [{ name: 'Devfile.io', link: 'https://docs.devfile.io/landing-page' }];

/**
 * Renders a {@link Layout} React component.
 * Adds a layout for all the webpages e.g. the header and background
 * @returns `<Layout><Component {...pageProps} /></Layout>`
 */
export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  const logoProps = {
    href: '/'
  };

  const nav = (
    <div className={styles.nav}>
      <Link href="/" data-testid="go-home-button">
        <a>
          <span className={styles.title}>
            <Brand src={devfileLogo} alt="Devfile Registry Logo" className={styles.logo} />
            <TextContent>
              <Text component={TextVariants.h3}>Devfile Registry</Text>
            </TextContent>
          </span>
        </a>
      </Link>
      <Nav variant="horizontal">
        <NavList>
          {navLinks.map((navLink) => (
            <NavItem key={navLink.name}>
              <a target="_blank" rel="noreferrer" href={navLink.link}>
                {navLink.name}
              </a>
            </NavItem>
          ))}
        </NavList>
      </Nav>
    </div>
  );

  const Header = <PageHeader logoProps={logoProps} topNav={nav} />;

  return (
    <Page header={Header}>
      <Meta />
      <PageSection variant={PageSectionVariants.light}>
        <main>{children}</main>
      </PageSection>
    </Page>
  );
};
Layout.displayName = 'Layout';
