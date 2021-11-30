import styles from './DevfilePageYAML.module.css';
import type { DefaultProps, Devfile } from 'custom-types';
import { getUserRegion } from '@src/util/client';
import copy from '@public/images/copy.svg';
import {
  Brand,
  Button,
  Card,
  CardBody,
  CardHeader,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github as style } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { useRouter } from 'next/router';
import getConfig from 'next/config';

export interface DevfilePageYAMLProps extends DefaultProps {
  devfile: Devfile;
  devfileYAML: string;
}

export const DevfilePageYAML: React.FC<DevfilePageYAMLProps> = ({
  devfile,
  devfileYAML,
  analytics,
}: DevfilePageYAMLProps) => {
  const router = useRouter();

  const onClick = (): void => {
    if (analytics) {
      const region = getUserRegion(router.locale);
      const { publicRuntimeConfig } = getConfig();

      analytics.track(
        'Copy Devfile Button Clicked',
        {
          client: publicRuntimeConfig.segmentClientId,
          devfile: devfile.name,
        },
        {
          context: { ip: '0.0.0.0', location: { country: region } },
          userId: analytics.user().anonymousId(),
        },
      );
    }
  };

  return (
    <Card data-testid="dev-page-yaml" className={styles.yamlCard}>
      <CardHeader className={styles.cardHeader}>
        <TextContent className={styles.text}>
          <Text>devfile.yaml</Text>
        </TextContent>
        <CopyToClipboard text={devfileYAML}>
          <Button data-testid="copy-devfile-button" className={styles.button} onClick={onClick}>
            <Brand src={copy} alt="Copy button" className={styles.image} />
          </Button>
        </CopyToClipboard>
      </CardHeader>
      <CardBody className={styles.cardBody}>
        <SyntaxHighlighter language="yaml" showLineNumbers style={style}>
          {devfileYAML}
        </SyntaxHighlighter>
      </CardBody>
    </Card>
  );
};
DevfilePageYAML.displayName = 'DevfilePageYAML';
