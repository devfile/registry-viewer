import { SearchInput, Text, TextContent, TextVariants } from '@patternfly/react-core'

interface Props {
  count: number,
  onSearchChange: (value: string) => void,
  searchValue: string
}

const DevfileSearchBar = ({ count, onSearchChange, searchValue }: Props): React.ReactElement => {
  return (
    <div style={{ display: 'flex' }}>
      <TextContent style={{ paddingRight: '1rem' }}>
        <Text component={TextVariants.h2}>Search</Text>
      </TextContent>
      <SearchInput
        style={{ flex: '1' }}
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
