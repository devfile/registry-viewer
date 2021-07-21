import { Devfile } from 'custom-types';
import devfileLogo from '../../public/images/devfileLogo.svg';
import HeaderTags from './HeaderTags';
import { Brand, Card, CardBody, Text, TextContent, TextVariants } from '@patternfly/react-core';

/**
 * props for devPage metadata header
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
const DevPageHeader = ({ devfile, devfileMetadata }: Props) => {
  const devfileMetaInclude = ['projectType', 'version', 'language']; // types to include in metadata from index

  return (
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
      <CardBody style={{ width: '100%' }}>
        <div style={{ display: 'flex', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              width: '50%',
              borderRight: '2px solid #ADABAE'
            }}
          >
            <div style={{ margin: '10px' }}>
              <Brand
                src={devfile.icon || devfileLogo}
                alt={devfile.icon ? devfile.name + ' logo' : 'devfile logo'}
                style={{ width: '60%' }}
              />
              <TextContent>
                <Text
                  style={{
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
                <Text component={TextVariants.h2} style={{ margin: '0.5rem' }}>
                  {devfile.displayName}
                </Text>
                <Text style={{ margin: '0.5rem' }}>&emsp;{devfile.description}</Text>
              </TextContent>
              <HeaderTags tags={devfile.tags} />
            </div>
          </div>
          <div style={{ width: '50%', margin: '2%' }}>
            <TextContent>
              {Object.entries(devfile).map(([key, value]) => {
                if (devfileMetaInclude.includes(key)) {
                  let label = key.replace(/([a-z](?=[A-Z]))/g, '$1 '); // split camel case up
                  label = label[0].toUpperCase() + label.substring(1);
                  return (
                    <Text>
                      <strong>{label + ': '}</strong>
                      {value}
                    </Text>
                  );
                }
              })}
              {devfile.type === 'stack' // include website if stack; include git if sample
                ? devfileMetadata &&
                  devfileMetadata.website && (
                    <Text>
                      <strong>Website: </strong>
                      <a href={devfileMetadata.website} target="_blank" rel="noreferrer">
                        {devfileMetadata.website}
                      </a>
                    </Text>
                  )
                : devfile.git && (
                    <a
                      href={devfile.git.remotes[Object.keys(devfile.git.remotes)[0]]}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Git Repository
                    </a>
                  )}
            </TextContent>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
export default DevPageHeader;
