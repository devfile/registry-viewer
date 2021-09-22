import styles from './Header.module.css';
import type { LayoutText } from 'custom-types';
import devfileLogo from '@public/images/devfileLogo.svg';
import _layoutText from '@info/layout-text.json';
import {
  Nav,
  NavItem,
  NavList,
  Text,
  TextContent,
  TextVariants,
  Brand,
  Grid,
  GridItem
} from '@patternfly/react-core';
import Link from 'next/link';

const layoutText = _layoutText as LayoutText;

export const Header: React.FC = () => (
  <header>
    <Grid className={styles.nav}>
      <GridItem span={12} sm={6}>
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
      </GridItem>
      <GridItem span={12} sm={6}>
        <Nav variant="horizontal">
          <NavList className={styles.navList}>
            {layoutText.headerLinks.map((headerLink) => (
              <NavItem key={headerLink.name}>
                {headerLink.link[0] === '/' ? (
                  <a href={headerLink.link}>
                    <TextContent>
                      <Text className={styles.text} component={TextVariants.h3}>
                        {headerLink.name}
                      </Text>
                    </TextContent>
                  </a>
                ) : (
                  <a target="_blank" rel="noreferrer" href={headerLink.link}>
                    <TextContent>
                      <Text className={styles.text} component={TextVariants.h3}>
                        {headerLink.name}
                      </Text>
                    </TextContent>
                  </a>
                )}
              </NavItem>
            ))}
          </NavList>
        </Nav>
      </GridItem>
    </Grid>
  </header>
);
Header.displayName = 'Header';
