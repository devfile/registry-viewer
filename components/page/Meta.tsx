import Head from 'next/head';

export interface MetaProps {
  title?: string;
  keywords?: string;
  description?: string;
}

/**
 * Renders a {@link Meta} React component.
 * Can change specific meta values in any pages
 * @returns `<Meta title={title} keywords={keywords} description={description}/>`
 */
const Meta: React.FC<MetaProps> = ({
  title,
  keywords,
  description,
}: MetaProps): React.ReactElement => (
  <Head>
    <title>{title}</title>
    <meta name="keywords" content={keywords} />
    <meta name="description" content={description} />

    <meta charSet="utf-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=5"
    />
    <meta name="theme-color" content="#317EFB" />

    <link rel="icon" href="/images/icons/favicon.ico" />
    <link rel="manifest" href="/manifest.json" />
  </Head>
);

Meta.defaultProps = {
  title: 'Devfile Registry',
  keywords: 'Devfile, Registry, OpenShift, Kubernetes',
  description: 'UI for the Devfile Registry',
};

export default Meta;
