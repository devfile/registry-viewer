import styles from './DevfilePageYAML.module.css';
import copy from '@public/images/copy.svg';
import {
  Brand,
  Button,
  Card,
  CardBody,
  CardHeader,
  Text,
  TextContent
} from '@patternfly/react-core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github as style } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

export interface DevfilePageYAMLProps {
  devfileYAML: string;
}

export const DevfilePageYAML: React.FC<DevfilePageYAMLProps> = ({
  devfileYAML
}: DevfilePageYAMLProps) => (
  <Card data-testid="dev-page-yaml" className={styles.yamlCard}>
    <CardHeader className={styles.cardHeader}>
      <TextContent className={styles.text}>
        <Text>devfile.yaml</Text>
      </TextContent>
      <CopyToClipboard text={devfileYAML}>
        <Button data-testid="copy-devfile-button" className={styles.button} variant="tertiary">
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
DevfilePageYAML.displayName = 'DevfilePageYAML';
