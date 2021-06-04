import type { Devfile } from 'customTypes'

import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from 'next'
import { Text, TextContent, TextVariants } from '@patternfly/react-core'

interface Path {
  params: { id: string }
}

const Home = ({ devfile }: InferGetStaticPropsType<typeof getStaticProps>) => {

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h2}>{devfile.displayName}</Text>
        <Text>{devfile.description}</Text>
      </TextContent>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const res: Response = await fetch('https://registry.devfile.io/index/all')
  const devfiles: Devfile[] = await res.json()
  const devfile: Devfile = (devfiles.find((devfile: Devfile) => {
    return devfile.name === context.params?.id
  })!)

  return {
    props: {
      devfile
    },
    revalidate: 21600 // Regenerate page every 6 hours
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res: Response = await fetch('https://registry.devfile.io/index/all')
  const devfiles: Devfile[] = await res.json()
  const ids: string[] = devfiles.map((devfile) => {
    return devfile.name
  })
  const paths: Path[] = ids.map((id) => ({ params: { id: id } }))

  return {
    paths,
    fallback: false
  }
}

export default Home
