import styles from './HomeGallerySearchBar.module.css';
import type { DefaultProps } from 'custom-types';
import { SearchInput, Text, TextContent, TextVariants } from '@patternfly/react-core';

export interface HomeSearchBarProps extends DefaultProps {
  devfileCount: number;
  onSearchBarChange: (value: string) => void;
  searchBarValue: string;
}

/**
 * Renders a {@link HomeGallerySearchBar} React component.
 * Adds a search bar for devfiles
 * @returns `<DevfileSearchBar devfileCount={devfileCount} onSearchBarChange={onSearchBarChange} searchBarValue={searchBarValue} />`
 */
export const HomeGallerySearchBar: React.FC<HomeSearchBarProps> = ({
  devfileCount,
  onSearchBarChange,
  searchBarValue,
}: HomeSearchBarProps) => (
  <div className={styles.searchBar}>
    <TextContent className={styles.searchBarText}>
      <Text component={TextVariants.h2}>Search</Text>
    </TextContent>
    <SearchInput
      data-testid="search-bar-devfile"
      className={styles.searchBarInput}
      placeholder="Search by name, tag, provider or description"
      value={searchBarValue}
      onChange={onSearchBarChange}
      onClear={(): void => onSearchBarChange('')}
      resultsCount={devfileCount}
    />
  </div>
);
HomeGallerySearchBar.displayName = 'HomeGallerySearchBar';
