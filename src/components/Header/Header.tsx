import styles from './Header.module.css';
import type { LayoutText, DefaultProps } from 'custom-types';
import _layoutText from '@info/layout-text.json';
import { getLayoutText } from '@src/util/client';
import {
  Nav,
  NavItem,
  NavList,
  Text,
  TextContent,
  TextVariants,
  Brand,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export const Header: React.FC<DefaultProps> = () => {
  const [layoutText, setLayoutText] = useState<LayoutText>(_layoutText);

  useEffect(() => {
    getLayoutText().then((layoutTextRes) => {
      setLayoutText(() => layoutTextRes);
    });
  }, []);

  return (
    <header data-testid="component-header">
      <Grid className={styles.nav}>
        <GridItem span={12} sm={6}>
          <Link href="/">
            <a className={styles.titleLink} data-testid="go-home-button">
              <span className={styles.title}>
                <Brand
                  src={`/images/${layoutText.logo}`}
                  alt="Devfile Registry Logo"
                  className={styles.logo}
                />
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
};
Header.displayName = 'Header';
