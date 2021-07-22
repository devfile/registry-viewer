import { Devfile } from 'custom-types';
import { getDevfilesJSON, getDevfileYAML } from '@util/server';
import DevfilePageProjects from '@components/devfile-page/Projects';
import DevfilePageHeader from '@components/devfile-page/Header';
import DevfilePageYAML from '@components/devfile-page/YAML';

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
const DevfilePage = ({
  devfile,
  devfileYAML,
  devfileJSON
}: InferGetStaticPropsType<typeof getStaticProps>) => (
  <div style={{ alignContent: 'center', minHeight: '100vh' }}>
    {devfile.type === 'stack' ? (
      <div>
        <DevfilePageHeader devfileMetadata={devfileJSON.metadata} devfile={devfile} />
        <DevfilePageProjects starterProjects={devfileJSON.starterProjects} />
        <DevfilePageYAML devfileYAML={devfileYAML} />
      </div>
    ) : (
      <DevfilePageHeader devfile={devfile} />
    )}
  </div>
);

export const getStaticProps: GetStaticProps = async (context) => {
  const devfiles: Devfile[] = await getDevfilesJSON();

  const devfile: Devfile = devfiles.find(
    (devfile: Devfile) => devfile.name === context.params?.id
  )!;

  const res = await getDevfileYAML(devfile);
  const devfileYAML = res?.devfileYAML;
  const devfileJSON = res?.devfileJSON;

  return {
    props: {
      devfile,
      devfileYAML,
      devfileJSON
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 30 seconds
    revalidate: 30
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const devfiles: Devfile[] = await getDevfilesJSON();
  const ids: string[] = devfiles.map((devfile) => devfile.name);
  const paths: Path[] = ids.map((id) => ({ params: { id } }));

  return {
    paths,
    fallback: false
  };
};

export default DevfilePage;
