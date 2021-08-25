import styles from './Banner.module.css';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';

export const Banner: React.FC = () => (
  <div className={styles.banner}>
    <TextContent>
      <Text className={styles.text} component={TextVariants.h1}>
        Welcome to Devfile Registry Viewer
      </Text>
      <Text className={styles.text} component={TextVariants.h3}>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cum pariatur iure dolor sint
        cumque ipsam porro numquam, ducimus repudiandae eos?
      </Text>
    </TextContent>
  </div>
);
Banner.displayName = 'Banner';
