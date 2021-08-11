import { Devfile } from 'custom-types';
import devfileLogo from '../../public/images/devfileLogo.svg';
import HeaderTags from './HeaderTags';
import { Brand, Card, CardBody, Text, TextContent, TextVariants } from '@patternfly/react-core';

/**
 * props for devfile page metadata header
 * @param devfile - devfile index information
 * @param metadata - metadata from
 */
interface Props {
  devfile: Devfile;
  devfileMetadata?: {
    [key: string]: string;
  };
}

/**
 * header that displays basic information and metadata information for respective devfile
 * @param devfile - index information for devfile
 * @param metadata - metadata information from devfile yaml
 */
const Header = ({ devfile, devfileMetadata }: Props) => {
  const devfileMetaInclude = ['projectType', 'version', 'language']; // types to include in metadata from index

  return (
    <Card
      data-testid="dev-page-header"
      isRounded
      style={{
        width: '75%',
        maxWidth: '1000px',
        margin: 'auto',
        marginTop: '30px',
        marginBottom: '30px'
      }}
    >
      <CardBody style={{ display: 'flex', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            width: '50%',
            borderRight: '2px solid #ADABAE'
          }}
        >
          <div style={{ margin: '10px', width: '30%' }}>
            <Brand
              data-testid="icon"
              src={devfile.icon || devfileLogo}
              alt={devfile.icon ? devfile.displayName + ' logo' : 'devfile logo'}
              style={{ width: '80%' }}
            />
            <TextContent>
              <Text
                data-testid="source-repo"
                style={{
                  margin: '0',
                  padding: '0',
                  color: '#ADABAE',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}
              >
                {devfile.sourceRepo}
              </Text>
              <Text
                data-testid="type"
                style={{
                  padding: '0',
                  color: '#ADABAE',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}
              >
                {devfile.type}
              </Text>
            </TextContent>
          </div>
          <div style={{ margin: '10px' }}>
            <TextContent>
              <Text
                data-testid="displayName"
                component={TextVariants.h2}
                style={{ margin: '0.5rem' }}
              >
                {devfile.displayName}
              </Text>
              {devfile.description && (
                <Text data-testid="description" style={{ margin: '0.5rem' }}>
                  &emsp;{devfile.description}
                </Text>
              )}
            </TextContent>
            <HeaderTags tags={devfile.tags} />
          </div>
        </div>
        <TextContent data-testid="devfile-metadata" style={{ width: '50%', margin: '2%' }}>
          {Object.entries(devfile).map(([key, value]) => {
            if (devfileMetaInclude.includes(key) && value) {
              let label = key.replace(/([a-z](?=[A-Z]))/g, '$1 '); // split camel case up
              label = label[0].toUpperCase() + label.substring(1);
              return (
                <Text data-testid={key} key={key}>
                  <strong>{label + ': '}</strong>
                  {value}
                </Text>
              );
            }
          })}
          {devfile.type === 'stack' // include website if stack; include git if sample
            ? devfileMetadata &&
              devfileMetadata.website && (
                <Text data-testid="website">
                  <strong>Website: </strong>
                  <a href={devfileMetadata.website} target="_blank" rel="noreferrer">
                    {devfileMetadata.website}
                  </a>
                </Text>
              )
            : devfile.git && (
                <Text data-testid="git-remotes">
                  <a
                    href={devfile.git.remotes[Object.keys(devfile.git.remotes)[0]]}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Git Repository
                  </a>
                </Text>
              )}
        </TextContent>
      </CardBody>
    </Card>
  );
};
export default Header;
