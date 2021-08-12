import { Devfile } from 'custom-types';
import devfileLogo from '../../public/images/devfileLogo.svg';
import HeaderTags from './HeaderTags';
import { Brand, Text, TextContent, TextVariants } from '@patternfly/react-core';
import styles from '@components/devfile-page/styles/Header.module.css';

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
    <div data-testid="dev-page-header" className={styles.headerCard}>
      <div className={styles.basicInfo}>
        <div className={styles.brand}>
          <Brand
            data-testid="icon"
            src={devfile.icon || devfileLogo}
            alt={devfile.icon ? devfile.displayName + ' logo' : 'devfile logo'}
            className={styles.logo}
          />
          <TextContent className={styles.types}>
            <Text data-testid="source-repo" className={styles.sourceRepo}>
              {devfile.sourceRepo}
            </Text>
            <Text data-testid="type" className={styles.type}>
              {devfile.type}
            </Text>
          </TextContent>
        </div>
        <div style={{ margin: '10px' }}>
          <TextContent>
            <Text
              data-testid="displayName"
              component={TextVariants.h2}
              className={styles.basicText}
            >
              {devfile.displayName}
            </Text>
            {devfile.description && (
              <Text data-testid="description" className={styles.basicText}>
                &emsp;{devfile.description}
              </Text>
            )}
          </TextContent>
          <HeaderTags tags={devfile.tags} />
        </div>
      </div>
      <TextContent data-testid="devfile-metadata" className={styles.metadata}>
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
    </div>
  );
};
export default Header;
