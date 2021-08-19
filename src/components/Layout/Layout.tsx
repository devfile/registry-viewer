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

// Local refers to a link that is on the same url as the parent
const navLinks = [
  { name: 'Getting Started', link: 'https://docs.devfile.io/landing-page/starting', local: false },
  { name: 'Docs', link: 'https://docs.devfile.io', local: false }
];

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
      <div className={styles.title}>
        <Brand src={devfileLogo} alt="Devfile Registry Logo" className={styles.logo} />
        <TextContent>
          <Text component={TextVariants.h3}>Devfile Registry</Text>
        </TextContent>
      </div>
      <Nav variant="horizontal">
        <NavList>
          {navLinks.map((navLink) =>
            navLink.local ? (
              <NavItem key={navLink.name}>
                <a>
                  <Link href={navLink.link}>
                    <TextContent>
                      <Text className={styles.navLinkText}>{navLink.name}</Text>
                    </TextContent>
                  </Link>
                </a>
              </NavItem>
            ) : (
              <NavItem key={navLink.name}>
                <a target="_blank" rel="noreferrer" href={navLink.link}>
                  <TextContent>
                    <Text className={styles.navLinkText}>{navLink.name}</Text>
                  </TextContent>
                </a>
              </NavItem>
            )
          )}
          <NavItem>
            <a>
              <Link href="/">
                <TextContent data-testid="go-home-button">
                  <Text className={styles.navLinkText}>Devfile Registry</Text>
                </TextContent>
              </Link>
            </a>
          </NavItem>
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
