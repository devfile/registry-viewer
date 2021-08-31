import styles from './Banner.module.css';
import type { LayoutText } from 'custom-types';
import _layoutText from '../../../config/devfile-layout-text.json';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useRouter } from 'next/router';
import { Wave } from '@src/components';

const layoutText = _layoutText as LayoutText;

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
                {layoutText.bannerTitle}
              </Text>
              <Text className={styles.text} component={TextVariants.h3}>
                {layoutText.bannerBody}
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
