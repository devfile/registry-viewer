import { Label, Popover } from '@patternfly/react-core';

/**
 *  props for {@link HeaderTags}
 */
interface Props {
  tags?: string[] | null;
}
/**
 * component to populate tags with popup for extra tags
 *
 * @param tags - list of tags to populate devfile page
 */
const HeaderTags = ({ tags }: Props) => {
  const numOfVisibleTags = 8;
  if (!tags?.length) {
    return null;
  }

  return (
    <div data-testid="header-tags">
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
          aria-label="close"
          position="bottom"
          bodyContent={
            <div>
              {tags.map(
                (tag, index) =>
                  index >= numOfVisibleTags && (
                    <Label color="blue" style={{ margin: '0.125rem' }} key={tag}>
                      {tag}
                    </Label>
                  )
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
export default HeaderTags;
