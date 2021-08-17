import { SearchInput, Text, TextContent, TextVariants } from '@patternfly/react-core';

export interface DevfileSearchBarProps {
  devfileCount: number;
  onSearchBarChange: (value: string) => void;
  searchBarValue: string;
}

/**
 * Renders a {@link DevfileGallerySearchBar} React component.
 * Adds a search bar for devfiles
 * @returns `<DevfileSearchBar devfileCount={devfileCount} onSearchBarChange={onSearchBarChange} searchBarValue={searchBarValue} />`
 */
export const DevfileGallerySearchBar: React.FC<DevfileSearchBarProps> = ({
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
      onClear={(): void => onSearchBarChange('')}
      resultsCount={devfileCount}
    />
  </div>
);
DevfileGallerySearchBar.displayName = 'DevfileGallerySearchBar';
