// Patternfly import needs to be first or the css will not be imported
import '@patternfly/react-core/dist/styles/base.css';
import { Layout } from '@src/components';
import Script from 'next/script';
import type { AppProps } from 'next/app';
import * as snippet from '@segment/snippet';

const { ANALYTICS_WRITE_KEY, NODE_ENV } = process.env;

/**
 * Renders the {@link App}
 */
const App: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const renderSnippet = (): string => {
    const options: snippet.Options = {
      apiKey: ANALYTICS_WRITE_KEY,
      page: true
    };

    if (NODE_ENV === 'development') {
      return snippet.max(options);
    }

    return snippet.min(options);
  };

  return (
    <Layout>
      <Script id="telemetry" dangerouslySetInnerHTML={{ __html: renderSnippet() }} />
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
