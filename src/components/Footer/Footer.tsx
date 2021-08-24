import styles from '../Layout/Layout.module.css';
import type { Link } from 'custom-types';
import devfileLogo from '@public/images/devfileLogo.svg';
import { Grid, GridItem, Text, TextContent, TextVariants, Brand } from '@patternfly/react-core';

const footerLinks: Link[] = [
  { name: 'Devfile.io', link: 'https://docs.devfile.io/landing-page' },
  { name: 'GitHub', link: 'https://github.com/devfile' }
];

export const Footer: React.FC = () => (
  <div
    style={{
      width: '100%',
      backgroundColor: 'var(--pf-global--BackgroundColor--dark-100)',
      padding: '3rem',
      position: 'relative',
      bottom: '0'
    }}
  >
    <Grid>
      <GridItem span={12} sm={6} style={{ display: 'flex', justifyContent: 'center' }}>
        <div className={styles.title}>
          <Brand src={devfileLogo} alt="Devfile Registry Logo" className={styles.logo} />
          <TextContent>
            <Text
              component={TextVariants.h1}
              style={{ color: 'var(--pf-global--Color--light-200)' }}
            >
              Devfile Registry
            </Text>
          </TextContent>
        </div>
      </GridItem>
      <GridItem span={12} sm={6} style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <TextContent>
            <Text
              component={TextVariants.h2}
              style={{ color: 'var(--pf-global--Color--light-200)' }}
            >
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
);
Footer.displayName = 'Footer';
