import styles from './DevfilePageHeader.module.css';
import { Devfile, FilterElem, DefaultProps } from 'custom-types';
import devfileLogo from '@public/images/devfileLogo.svg';
import { DevfilePageHeaderTags, DevfilePageHeaderShareButton } from '@src/components';
import { capitalizeFirstLetter, splitCamelCase } from '@src/util/client';
import { Brand, Text, TextContent, TextVariants } from '@patternfly/react-core';

/**
 * props for devfile page metadata header
 * @param devfile - devfile index information
 * @param metadata - metadata from
 */
export interface DevfilePageHeaderProps extends DefaultProps {
  devfile: Devfile;
  devfileMetadata?: {
    [key: string]: string;
  };
  registries: FilterElem[];
}

/**
 * header that displays basic information and metadata information for respective devfile
 * @param devfile - index information for devfile
 * @param metadata - metadata information from devfile yaml
 */
export const DevfilePageHeader: React.FC<DevfilePageHeaderProps> = ({
  devfile,
  devfileMetadata,
  registries,
  analytics,
}: DevfilePageHeaderProps) => {
  const devfileMetaInclude = ['projectType', 'version', 'language', 'provider']; // types to include in metadata from index

  return (
    <div data-testid="dev-page-header" className={styles.headerCard}>
      <div className={styles.devfileInfo}>
        <TextContent className={styles.types}>
          {registries.length > 1 && (
            <Text data-testid="registry" className={styles.registry}>
              {devfile.registry}
            </Text>
          )}
          <Text data-testid="type" className={styles.type}>
            {capitalizeFirstLetter(devfile.type)}
          </Text>
        </TextContent>
      </div>
      <div className={styles.linkButton}>
        <DevfilePageHeaderShareButton analytics={analytics} devfile={devfile} />
      </div>
      <div className={styles.basicInfo}>
        <Brand
          data-testid="icon"
          src={devfile.icon || devfileLogo}
          alt={devfile.icon ? devfile.displayName + ' logo' : 'devfile logo'}
          className={styles.brand}
        />
        <div>
          <TextContent>
            <Text
              data-testid="displayName"
              component={TextVariants.h2}
              className={styles.basicText}
            >
              {devfile.displayName}
            </Text>
            {devfile.description && (
              <Text data-testid="description" className={styles.longDescription}>
                {devfile.description}
              </Text>
            )}
          </TextContent>
          {devfile?.tags && <DevfilePageHeaderTags tags={devfile.tags} />}
        </div>
      </div>
      <div className={styles.border} />
      <TextContent data-testid="devfile-metadata" className={styles.metadata}>
        {Object.entries(devfile).map(([key, value]) => {
          if (devfileMetaInclude.includes(key) && value) {
            const label = splitCamelCase(key);
            return (
              <Text data-testid={key} key={key}>
                <strong>{`${capitalizeFirstLetter(label)}: `}</strong>
                {value}
              </Text>
            );
          }
        })}
        {devfile.type === 'stack' // include website if stack; include git if sample
          ? devfileMetadata?.website && (
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
        {devfileMetadata?.supportUrl && (
          <Text data-testid="support-information">
            <a href={devfileMetadata.supportUrl} target="_blank" rel="noreferrer">
              Support Information
            </a>
          </Text>
        )}
      </TextContent>
    </div>
  );
};
DevfilePageHeader.displayName = 'DevfilePageHeader';
