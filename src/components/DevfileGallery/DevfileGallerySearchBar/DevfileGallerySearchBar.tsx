import styles from './DevfileGallerySearchBar.module.css';
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
  <div className={styles.searchBar}>
    <TextContent className={styles.searchBarText}>
      <Text component={TextVariants.h2}>Search</Text>
    </TextContent>
    <SearchInput
      data-test-id="search-bar-devfile"
      className={styles.searchBarInput}
      placeholder="Find by name, tag, or description"
      value={searchBarValue}
      onChange={onSearchBarChange}
      onClear={(): void => onSearchBarChange('')}
      resultsCount={devfileCount}
    />
  </div>
);
DevfileGallerySearchBar.displayName = 'DevfileGallerySearchBar';
