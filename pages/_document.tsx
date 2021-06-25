import Document, { Html, Head, Main, NextScript } from 'next/document';

/**
 * Renders the {@link MyDocument}
 */
class MyDocument extends Document {
  render(): React.ReactElement {
    return (
      <Html lang="en-US">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
