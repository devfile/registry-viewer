import styles from '@src/styles/devfiles/[id]/index.module.css';
import { Devfile } from 'custom-types';
import { getDevfileRegistryJSON, getDevfileYAML, getFilterElemArr } from '@src/util/server';
import { serializeURL } from '@src/util/client';
import {
  DevfilePageProjects,
  DevfilePageHeader,
  DevfilePageYAML,
  ErrorBanner,
} from '@src/components';
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths, NextPage } from 'next';

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
const DevfilePage: NextPage<InferGetStaticPropsType<GetStaticProps>> = ({
  devfile,
  devfileYAML,
  devfileJSON,
  registries,
  errors,
  analytics,
}: InferGetStaticPropsType<GetStaticProps>) => (
  <div className={styles.devfilePage}>
    <ErrorBanner errors={errors} />
    <DevfilePageHeader
      analytics={analytics}
      devfileMetadata={devfileJSON?.metadata}
      devfile={devfile}
      registries={registries}
    />
    {devfileJSON?.starterProjects?.length && devfile.type === 'stack' && (
      <DevfilePageProjects
        analytics={analytics}
        devfile={devfile}
        starterProjects={devfileJSON.starterProjects}
      />
    )}
    {devfileYAML && (
      <DevfilePageYAML analytics={analytics} devfile={devfile} devfileYAML={devfileYAML} />
    )}
  </div>
);

export const getStaticProps: GetStaticProps = async (context) => {
  const [devfiles, devfileErrors] = await getDevfileRegistryJSON();
  const id = context.params?.id as string;
  const [source, name] = id.split('+');

  const devfile: Devfile = devfiles.find(
    (devfile: Devfile) => devfile.registry === source && devfile.name === name,
  )!;

  const [devfileYAML, devfileJSON, yamlErrors] = await getDevfileYAML(devfile);

  const errors = [...devfileErrors, ...yamlErrors];

  const registries = getFilterElemArr(devfiles, 'registry');

  return {
    props: {
      devfile,
      devfileYAML,
      devfileJSON,
      registries,
      errors,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 15 seconds
    revalidate: 15,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const [devfiles] = await getDevfileRegistryJSON();
  const sourceWithNames = devfiles.map((devfile) => serializeURL(devfile));
  const paths: Path[] = sourceWithNames.map((id) => ({ params: { id } }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export default DevfilePage;
