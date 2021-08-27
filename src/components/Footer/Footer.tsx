import styles from './Footer.module.css';
import type { Link } from 'custom-types';
import { Wave } from '@src/components';
import devfileLogo from '@public/images/devfileLogo.svg';
import { Grid, GridItem, Text, TextContent, TextVariants, Brand } from '@patternfly/react-core';

const footerLinks: Link[] = [
  { name: 'Devfile.io', link: 'https://docs.devfile.io/' },
  { name: 'GitHub', link: 'https://github.com/devfile/registry' }
];

export const Footer: React.FC = () => (
  <footer>
    <div className={styles.footer}>
      <Wave fill="darker" backgroundColor="light" flipX={true} flipY={true} />
      <Grid className={styles.footerGrid}>
        <GridItem span={12} sm={6} className={styles.footerGridItem}>
          <div className={styles.title}>
            <Brand src={devfileLogo} alt="Devfile Registry Logo" className={styles.logo} />
            <TextContent>
              <Text component={TextVariants.h1} className={styles.text}>
                Devfile Registry
              </Text>
            </TextContent>
          </div>
        </GridItem>
        <GridItem span={12} sm={6} className={styles.footerGridItem}>
          <div>
            <TextContent>
              <Text component={TextVariants.h2} className={styles.text}>
                Links
              </Text>
            </TextContent>
            <ul>
              {footerLinks.map((footerLink) => (
                <li key={footerLink.name}>
                  <a target="_blank" rel="noreferrer" href={footerLink.link}>
                    {footerLink.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </GridItem>
      </Grid>
    </div>
  </footer>
);
Footer.displayName = 'Footer';
