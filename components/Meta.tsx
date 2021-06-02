import Head from 'next/head'

interface MetaProps {
  title?: string,
  keywords?: string,
  description?: string
}

const Meta = ({ title, keywords, description }: MetaProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name='keywords' content={keywords} />
      <meta name="description" content={description} />

      <meta charSet='utf-8' />
      <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
      <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=5' />
      <meta name="theme-color" content="#317EFB"/>

      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  )
}

Meta.defaultProps = {
  title: 'Devfile Registry',
  keywords: 'Keywords',
  description: 'Description'
}

export default Meta
