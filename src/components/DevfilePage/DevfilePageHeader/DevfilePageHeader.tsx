import styles from './DevfilePageHeader.module.css';
import { Devfile, FilterElem } from 'custom-types';
import devfileLogo from '@public/images/devfileLogo.svg';
import { DevfilePageHeaderTags, DevfilePageHeaderShareButton } from '@src/components';
import { capitalizeFirstLetter, splitCamelCase } from '@src/util/client';
import { Brand, Text, TextContent, TextVariants } from '@patternfly/react-core';

/**
 * props for devfile page metadata header
 * @param devfile - devfile index information
 * @param metadata - metadata from
 */
export interface DevfilePageHeaderProps {
  devfile: Devfile;
  devfileMetadata?: {
    [key: string]: string;
  };
  sourceRepos: FilterElem[];
}

/**
 * header that displays basic information and metadata information for respective devfile
 * @param devfile - index information for devfile
 * @param metadata - metadata information from devfile yaml
 */
export const DevfilePageHeader: React.FC<DevfilePageHeaderProps> = ({
  devfile,
  devfileMetadata,
  sourceRepos
}: DevfilePageHeaderProps) => {
  const devfileMetaInclude = ['projectType', 'version', 'language', 'provider']; // types to include in metadata from index

  return (
    <div data-testid="dev-page-header" className={styles.headerCard}>
      <div className={styles.linkButton}>
        <DevfilePageHeaderShareButton devfile={devfile} />
      </div>
      <div className={styles.basicInfo}>
        <div className={styles.brand}>
          <Brand
            data-testid="icon"
            src={devfile.icon || devfileLogo}
            alt={devfile.icon ? devfile.displayName + ' logo' : 'devfile logo'}
            className={styles.logo}
          />
          <TextContent className={styles.types}>
            {sourceRepos.length > 1 && (
              <Text data-testid="source-repo" className={styles.sourceRepo}>
                {devfile.sourceRepo}
              </Text>
            )}
            <Text data-testid="type" className={styles.type}>
              {capitalizeFirstLetter(devfile.type)}
            </Text>
          </TextContent>
        </div>
        <div className={styles.headerCardBody}>
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
                {devfile.description}
              </Text>
            )}
          </TextContent>
          {devfile?.tags && <DevfilePageHeaderTags tags={devfile.tags} />}
        </div>
      </div>
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
