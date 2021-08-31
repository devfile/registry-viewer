import styles from './ErrorBanner.module.css';
import { Banner, Text, TextContent, TextVariants } from '@patternfly/react-core';

export interface ErrorBannerProps {
  errors: string[];
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ errors }: ErrorBannerProps) => (
  <>
    {errors.filter((error: string) => error !== '').length ? (
      <div className={styles.errorBanner}>
        <Banner isSticky variant="danger">
          <TextContent>
            <Text className={styles.errorBannerText} component={TextVariants.h1}>
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
ErrorBanner.displayName = 'ErrorBanner';
