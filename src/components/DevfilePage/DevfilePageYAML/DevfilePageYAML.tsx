import styles from './DevfilePageYAML.module.css';
import { Card, CardBody, CardHeader } from '@patternfly/react-core';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github as style } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
/**
 * props for DevFile YAML component
 *
 * @param devYAML - yaml text
 */
export interface DevfilePageYAMLProps {
  devfileYAML: string;
}
/**
 * component  for displaying DevFile YAML
 *
 * @remarks
 *      component only for stacks, won't be present for samples
 *
 * @param props - yaml text
 */
export const DevfilePageYAML: React.FC<DevfilePageYAMLProps> = ({
  devfileYAML
}: DevfilePageYAMLProps) => (
  <Card data-testid="dev-page-yaml" className={styles.yamlCard}>
    <CardHeader className={styles.cardHeader}>devfile.yaml</CardHeader>
    <CardBody className={styles.cardBody}>
      <SyntaxHighlighter language="yaml" showLineNumbers style={style}>
        {devfileYAML}
      </SyntaxHighlighter>
    </CardBody>
  </Card>
);
DevfilePageYAML.displayName = 'DevfilePageYAML';
