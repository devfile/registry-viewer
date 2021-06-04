import '@patternfly/react-core/dist/styles/base.css' // This import needs to be first or the css will not be imported

import Layout from '@components/Layout'

import type { AppProps } from 'next/app'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default App