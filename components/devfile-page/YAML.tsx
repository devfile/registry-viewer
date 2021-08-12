import { Card, CardBody, CardHeader } from '@patternfly/react-core';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github as style } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import styles from '@components/devfile-page/styles/YAML.module.css';
/**
 * props for DevFile YAML component
 *
 * @param devYAML - yaml text
 */
interface Props {
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
const DevPageYAML = ({ devfileYAML }: Props) => (
  <Card
    data-testid="dev-page-yaml"
    isRounded
    className= {styles.yamlCard}
  >
    <CardHeader className={styles.cardHeader}>devfile.yaml</CardHeader>
    <CardBody className={styles.cardBody}>
      <SyntaxHighlighter language="yaml" showLineNumbers style={style}>
        {devfileYAML}
      </SyntaxHighlighter>
    </CardBody>
  </Card>
);

export default DevPageYAML;
