import { Banner, Text, TextContent, TextVariants } from '@patternfly/react-core';

export interface ErrorBannerProps {
  errors: string[];
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ errors }: ErrorBannerProps) => (
  <>
    {errors.filter((error: string) => error !== '').length ? (
      <div style={{ marginBottom: '1rem' }}>
        <Banner isSticky variant="danger">
          <TextContent>
            <Text style={{ textAlign: 'center' }} component={TextVariants.h1}>
              Error: Cannot receive valid server response!
            </Text>
          </TextContent>
        </Banner>
      </div>
    ) : (
      <></>
    )}
  </>
);

export default ErrorBanner;
