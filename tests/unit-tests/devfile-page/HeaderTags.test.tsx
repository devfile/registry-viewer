import HeaderTags from '../../../components/devfile-page/HeaderTags';
import { Label, Popover } from '@patternfly/react-core';
import { shallow } from 'enzyme';

/** testing partitions
 *
 * HeaderTags
 *    tags:
 *      null, empty list, list <= numOfVisibleTags, list > numOfVisibleTags
 */

describe('<HeaderTags />', () => {
  const numOfVisibleTags = 8; // set to the same value as numOfVisibleTags in HeaderTags
  let wrapper = shallow(<HeaderTags tags={[]} />);

  test('tags prop set to null, check that HeaderTags is null', () => {
    wrapper.setProps({
      tags: null
    });

    expect(wrapper.type()).toEqual(null);
  });
  test('tags prop set to empty list, check that HeaderTags is null', () => {
    wrapper.setProps({
      tags: new Array(0)
    });

    expect(wrapper.type()).toEqual(null);
  });

  test('number of tags is equal to set numOfVisibleTags, no popup', () => {
    wrapper.setProps({
      tags: Array.from(new Array(numOfVisibleTags), (value, index) => 'tag' + index)
    });
    // Check popup isn't generated
    expect(wrapper.find(Popover).length).toBe(0);
    // Check for visible tags
    expect(wrapper.find(Label).length).toBe(numOfVisibleTags);
  });

  test('number of tags is greater than set numOfVisibleTags, popup rendered', () => {
    const numOfPopupTags = 5;

    const tags = Array.from(
      new Array(numOfVisibleTags + numOfPopupTags),
      (_, index) => 'tag' + index
    );
    wrapper.setProps({ tags: tags });

    const popover = wrapper.find(Popover);
    const labels = wrapper.find(Label);
    // @ts-ignore
    const popoverContent = shallow(popover.prop('bodyContent'));
    const popoverLabels = popoverContent.find(Label);

    // Check popup is generated
    expect(popover.length).toBe(1);

    // Check for visible tags
    expect(labels.length).toBe(numOfVisibleTags + 1);

    // Check for popup tags
    expect(popoverLabels.length).toBe(numOfPopupTags);

    const labelKeySet = new Set(tags);

    // Check for correct keys
    labels.forEach((label) => {
      const key = label.key();

      if (key.includes('popover-label')) {
        expect(key).toBe('popover-label-' + numOfPopupTags);
      } else {
        expect(labelKeySet.has(key)).toBeTruthy();
        labelKeySet.delete(key);
      }
    });

    popoverLabels.forEach((label) => {
      const key = label.key();
      if (key.includes('popover-tags')) {
        expect(key).toBe('popover-tags-${numOfVisibleTags}');
      } else {
        expect(labelKeySet.has(key)).toBeTruthy();
        labelKeySet.delete(key);
      }
    });
    // Check that all tags were used
    expect(labelKeySet.size).toBe(0);
  });
});
