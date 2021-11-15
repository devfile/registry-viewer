import { Html, Head, Main, NextScript } from 'next/document';
import { NextPage } from 'next';

/**
 * Renders the {@link MyDocument}
 */

const MyDocument: NextPage = () => (
  <Html lang="en-US">
    <Head />
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default MyDocument;
