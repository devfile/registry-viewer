import styles from './Header.module.css';
import type { Link as LinkItem } from 'custom-types';
import devfileLogo from '@public/images/devfileLogo.svg';
import {
  Nav,
  NavItem,
  NavList,
  Text,
  TextContent,
  TextVariants,
  Brand
} from '@patternfly/react-core';
import Link from 'next/link';

const navLinks: LinkItem[] = [{ name: 'Devfile.io', link: 'https://docs.devfile.io/landing-page' }];

export const Header: React.FC = () => (
  <header>
    <div className={styles.nav}>
      <Link href="/">
        <a className={styles.titleLink} data-testid="go-home-button">
          <span className={styles.title}>
            <Brand src={devfileLogo} alt="Devfile Registry Logo" className={styles.logo} />
            <TextContent>
              <Text className={styles.text} component={TextVariants.h1}>
                Devfile Registry
              </Text>
            </TextContent>
          </span>
        </a>
      </Link>
      <Nav variant="horizontal">
        <NavList>
          {navLinks.map((navLink) => (
            <NavItem key={navLink.name}>
              <a target="_blank" rel="noreferrer" href={navLink.link}>
                <TextContent>
                  <Text className={styles.text} component={TextVariants.h3}>
                    {navLink.name}
                  </Text>
                </TextContent>
              </a>
            </NavItem>
          ))}
        </NavList>
      </Nav>
    </div>
  </header>
);
Header.displayName = 'Header';
