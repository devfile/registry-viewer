import styles from '@src/styles/devfiles/[id]/index.module.css';
import { Devfile } from 'custom-types';
import { getMetadataOfDevfiles, getDevfileYAML } from '@src/util/server';
import {
  DevfilePageProjects,
  DevfilePageHeader,
  DevfilePageYAML,
  ErrorBanner
} from '@src/components';
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from 'next';

interface Path {
  params: { id: string };
}
/**
 * Renders the {@link DevfilePage}
 *
 * @remarks
 *    stacks have header, starter projects, and yaml
 *    sample has header
 *
 * @param devfile - index information for devfile
 * @param devfileText - text of devfile YAML, null when sample
 * @param devfileJSON -  json representation of devfile YAML, null when sample
 */
const DevfilePage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  devfile,
  devfileYAML,
  devfileJSON,
  errors
}: InferGetStaticPropsType<typeof getStaticProps>) => (
  <div className={styles.devfilePage}>
    <ErrorBanner errors={errors} />
    <DevfilePageHeader devfileMetadata={devfileJSON?.metadata} devfile={devfile} />
    {devfileJSON?.starterProjects?.length && (
      <DevfilePageProjects starterProjects={devfileJSON.starterProjects} />
    )}
    {devfileYAML && <DevfilePageYAML devfileYAML={devfileYAML} />}
  </div>
);

export const getStaticProps: GetStaticProps = async (context) => {
  const [devfiles, devfileErrors] = await getMetadataOfDevfiles();

  const devfile: Devfile = devfiles.find((devfile: Devfile) => {
    const id = context.params?.id as string;
    const [source, name] = id.split('+');
    return devfile.sourceRepo === source && devfile.name === name;
  })!;

  const [devfileYAML, devfileJSON, yamlErrors] = await getDevfileYAML(devfile);

  const errors = [...devfileErrors, ...yamlErrors];

  if (devfile.type === 'sample') {
    // eslint-disable-next-line no-console
    console.log(devfileYAML);
  }

  return {
    props: {
      devfile,
      devfileYAML,
      devfileJSON,
      errors
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 15 seconds
    revalidate: 15
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [devfiles, _] = await getMetadataOfDevfiles();
  const sourceWithNames = devfiles.map(
    (devfile) => `${devfile.sourceRepo.replace(/\+/g, '')}+${devfile.name.replace(/\+/g, '')}`
  );
  const paths: Path[] = sourceWithNames.map((id) => ({ params: { id } }));

  return {
    paths,
    fallback: 'blocking'
  };
};

export default DevfilePage;
