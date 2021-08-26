import styles from './Banner.module.css';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useRouter } from 'next/router';
import { Wave } from '@src/components';

export const Banner: React.FC = () => {
  const router = useRouter();
  return (
    <>
      {router.asPath === '/' ? (
        <>
          <Wave fill="darker" backgroundColor="dark" />
          <div className={styles.banner}>
            <TextContent>
              <Text className={styles.text} component={TextVariants.h1}>
                Welcome to the Devfile.io Community Devfile Registry
              </Text>
              <Text className={styles.text} component={TextVariants.h3}>
                Browse devfile stacks and samples
              </Text>
            </TextContent>
          </div>
        </>
      ) : (
        <Wave fill="darker" backgroundColor="light" />
      )}
    </>
  );
};
Banner.displayName = 'Banner';
