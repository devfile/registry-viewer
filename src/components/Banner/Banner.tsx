import styles from './Banner.module.css';
import type { LayoutText, DefaultProps } from 'custom-types';
import _layoutText from '@info/layout-text.json';
import { Wave } from '@src/components';
import { getLayoutText } from '@src/util/client';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export const Banner: React.FC<DefaultProps> = () => {
  const router = useRouter();
  const [layoutText, setLayoutText] = useState<LayoutText>(_layoutText);

  useEffect(() => {
    getLayoutText().then((layoutTextRes) => {
      setLayoutText(() => layoutTextRes);
    });
  }, []);

  return (
    <>
      {router.asPath === '/' && !process.env.DEVFILE_BANNER ? (
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
