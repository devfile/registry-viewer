import { Card, CardBody, CardHeader } from '@patternfly/react-core';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github as style } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
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
    isRounded
    style={{
      width: '75%',
      maxWidth: '1000px',
      margin: 'auto',
      marginTop: '30px',
      marginBottom: '30px'
    }}
  >
    <CardHeader style={{ padding: '10px' }}>devfile.yaml</CardHeader>
    <CardBody style={{ padding: '0' }}>
      <SyntaxHighlighter language="yaml" showLineNumbers style={style}>
        {devfileYAML}
      </SyntaxHighlighter>
    </CardBody>
  </Card>
);

export default DevPageYAML;
