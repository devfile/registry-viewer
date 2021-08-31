import styles from './Header.module.css';
import type { LayoutText } from 'custom-types';
import devfileLogo from '@public/images/devfileLogo.svg';
import _layoutText from '../../../config/devfile-layout-text.json';
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

const layoutText = _layoutText as LayoutText;

export const Header: React.FC = () => (
  <header>
    <div className={styles.nav}>
      <Link href="/">
        <a className={styles.titleLink} data-testid="go-home-button">
          <span className={styles.title}>
            <Brand src={devfileLogo} alt="Devfile Registry Logo" className={styles.logo} />
            <TextContent>
              <Text className={styles.text} component={TextVariants.h1}>
                {layoutText.title}
              </Text>
            </TextContent>
          </span>
        </a>
      </Link>
      <Nav variant="horizontal">
        <NavList>
          {layoutText.headerLinks.map((headerLink) => (
            <NavItem key={headerLink.name}>
              <a target="_blank" rel="noreferrer" href={headerLink.link}>
                <TextContent>
                  <Text className={styles.text} component={TextVariants.h3}>
                    {headerLink.name}
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
