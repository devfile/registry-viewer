import type { Devfile } from 'custom-types';

import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from 'next';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';

interface Path {
  params: { id: string };
}

/**
 * Renders the {@link DevfilePage}
 */
const DevfilePage: React.FC<InferGetStaticPropsType<GetStaticProps>> = ({
  devfile,
}: InferGetStaticPropsType<GetStaticProps>) => (
  <>
    <TextContent>
      <Text component={TextVariants.h2}>{devfile.displayName}</Text>
      <Text>{devfile.description}</Text>
    </TextContent>
  </>
);

export const getStaticProps: GetStaticProps = async (context) => {
  const res: Response = await fetch(
    'https://registry.devfile.io/index/all?icon=base64'
  );
  const devfiles: Devfile[] = (await res.json()) as Devfile[];
  const devfile: Devfile = devfiles.find(
    (devfile: Devfile) => devfile.name === context.params?.id
  )!;

  return {
    props: {
      devfile,
    },
    revalidate: 21600, // Regenerate page every 6 hours
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res: Response = await fetch(
    'https://registry.devfile.io/index/all?icon=base64'
  );
  const devfiles: Devfile[] = (await res.json()) as Devfile[];
  const ids: string[] = devfiles.map((devfile) => devfile.name);
  const paths: Path[] = ids.map((id) => ({ params: { id } }));

  return {
    paths,
    fallback: false,
  };
};

export default DevfilePage;
