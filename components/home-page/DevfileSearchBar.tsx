import { SearchInput, Text, TextContent, TextVariants } from '@patternfly/react-core'

interface Props {
  count: number,
  onSearchChange: (value: string) => void,
  searchValue: string
}

const DevfileSearchBar = ({ count, onSearchChange, searchValue }: Props): React.ReactElement => {
  return (
    <div className="flex">
      <TextContent className="pr-4">
        <Text component={TextVariants.h2}>Search</Text>
      </TextContent>
      <SearchInput
        data-test-id="search-bar-devfile"
        className="flex-1"
        placeholder='Find by name, tag, or description'
        value={searchValue}
        onChange={onSearchChange}
        onClear={() => onSearchChange('')}
        resultsCount={count}
      />
    </div>
  )
}

export default DevfileSearchBar
