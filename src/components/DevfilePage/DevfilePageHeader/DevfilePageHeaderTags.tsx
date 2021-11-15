import styles from './DevfilePageHeaderTags.module.css';
import type { DefaultProps } from 'custom-types';
import { Label, Popover } from '@patternfly/react-core';

/**
 *  props for {@link DevfilePageHeaderTags}
 */
export interface DevfilePageHeaderTagsProps extends DefaultProps {
  tags: string[];
}
/**
 * component to populate tags with popup for extra tags
 *
 * @param tags - list of tags to populate devfile page
 */
export const DevfilePageHeaderTags: React.FC<DevfilePageHeaderTagsProps> = ({
  tags,
}: DevfilePageHeaderTagsProps) => {
  const numOfVisibleTags = 8;
  return (
    <div data-testid="header-tags">
      {tags.map(
        (tag, index) =>
          index < numOfVisibleTags && (
            <Label color="blue" className={styles.tag} key={tag}>
              {tag}
            </Label>
          ),
      )}

      {tags.length > numOfVisibleTags && (
        <Popover
          aria-label="close"
          position="bottom"
          bodyContent={
            <div>
              {tags.map(
                (tag, index) =>
                  index >= numOfVisibleTags && (
                    <Label color="blue" className={styles.tag} key={tag}>
                      {tag}
                    </Label>
                  ),
              )}
            </div>
          }
        >
          <Label key={'popover-label-' + (tags.length - numOfVisibleTags)}>
            {tags.length - numOfVisibleTags} more
          </Label>
        </Popover>
      )}
    </div>
  );
};
DevfilePageHeaderTags.displayName = 'DevfilePageHeaderTags';
