import '@patternfly/react-core/dist/styles/base.css'; // This import needs to be first or the css will not be imported

import Layout from '@components/page/Layout';

import type { AppProps } from 'next/app';

/**
 * Renders the {@link App}
 */
const App: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => (
  <Layout>
    <Component {...pageProps} />
  </Layout>
);

export default App;
