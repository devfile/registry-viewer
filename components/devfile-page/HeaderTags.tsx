import { Label, Popover } from '@patternfly/react-core';

/**
 *  props for {@link HeaderTags}
 */
interface Props {
  tags: string[] | null;
}
/**
 * component to populate tags with popup for extra tags
 *
 * @param tags - list of tags to populate devfile page
 */
const HeaderTags = ({ tags }: Props) => {
  const numOfVisibleTags = 8;
  if (!tags) {
    return null;
  }

  return (
    <div>
      {tags.map(
        (tag, index) =>
          index < numOfVisibleTags && (
            <Label color="blue" style={{ margin: '0.125rem' }} key={tag}>
              {tag}
            </Label>
          )
      )}

      {tags.length > numOfVisibleTags && (
        <Popover
          aria-label="extra tags popover"
          position="bottom"
          bodyContent={
            <div>
              {tags.map(
                (tag, index) =>
                  index >= numOfVisibleTags && (
                    <Label
                      color="blue"
                      style={{ margin: '0.125rem' }}
                      key={tag}
                    >
                      {tag}
                    </Label>
                  )
              )}
            </div>
          }
        >
          <Label>{tags.length - numOfVisibleTags} more</Label>
        </Popover>
      )}
    </div>
  );
};
export default HeaderTags;
