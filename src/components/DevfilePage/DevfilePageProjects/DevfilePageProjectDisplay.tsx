import styles from './DevfilePageProjectDisplay.module.css';
import type { Project, DefaultProps } from 'custom-types';
import { Text, TextContent } from '@patternfly/react-core';

export interface DevfilePageProjectDisplayProps extends DefaultProps {
  project: Project;
}

/**
 * component that displays the name and description of the selected and/or hovered project
 *
 * @param props - project to display
 * @returns
 */
export const DevfilePageProjectDisplay: React.FC<DevfilePageProjectDisplayProps> = ({
  project,
}: DevfilePageProjectDisplayProps) => (
  <TextContent>
    <Text data-testid="display-hovered-project-name" className={styles.displayedName}>
      {project.name}
    </Text>
    <Text data-testid="display-hovered-project-description" className={styles.displayedDescription}>
      {project.description}
    </Text>
  </TextContent>
);
DevfilePageProjectDisplay.displayName = 'DevfilePageProjectDisplay';
