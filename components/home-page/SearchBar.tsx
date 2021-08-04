import { SearchInput, Text, TextContent, TextVariants } from '@patternfly/react-core';

export interface DevfileSearchBarProps {
  devfileCount: number;
  onSearchBarChange: (value: string) => void;
  searchBarValue: string;
}

/**
 * Renders a {@link DevfileSearchBar} React component.
 * Adds a search bar for devfiles
 * @returns `<DevfileSearchBar devfileCount={devfileCount} onSearchBarChange={onSearchBarChange} searchBarValue={searchBarValue} />`
 */
const DevfileSearchBar: React.FC<DevfileSearchBarProps> = ({
  devfileCount,
  onSearchBarChange,
  searchBarValue
}: DevfileSearchBarProps) => (
  <div style={{ display: 'flex' }}>
    <TextContent style={{ paddingRight: '1rem' }}>
      <Text component={TextVariants.h2}>Search</Text>
    </TextContent>
    <SearchInput
      data-test-id="search-bar-devfile"
      style={{ flex: '1 1 0%' }}
      placeholder="Find by name, tag, or description"
      value={searchBarValue}
      onChange={onSearchBarChange}
      onClear={() => onSearchBarChange('')}
      resultsCount={devfileCount}
    />
  </div>
);

export default DevfileSearchBar;
