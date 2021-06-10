import type { FilterDataElem } from 'custom-types'
import type { Dispatch, SetStateAction } from 'react'

import { Checkbox, Form, FormGroup, SearchInput, Text, TextContent, TextVariants } from '@patternfly/react-core'
import { useState, useEffect } from 'react'

interface Props {
  tagsData: FilterDataElem[],
  typesData: FilterDataElem[],
  setTagsData: Dispatch<SetStateAction<FilterDataElem[]>>,
  setTypesData: Dispatch<SetStateAction<FilterDataElem[]>>
}

const Filter = ({ tagsData, typesData, setTagsData, setTypesData }: Props): React.ReactElement => {
  const baseNumTags = 10

  const [tagSearch, setTagSearch] = useState('')
  const [numTags, setNumTags] = useState(baseNumTags)

  useEffect(() => {
    setTypesData(sortFilterDataArr(typesData))
  }, [typesData])

  useEffect(() => {
    setTagsData(sortFilterDataArr(tagsData))
  }, [tagsData])

  const sortFilterDataArr = (tagsData: FilterDataElem[]): FilterDataElem[] => {
    const copy: FilterDataElem[] = tagsData.sort((a, b) => {
      if (a.state === b.state) {
        return a.value.localeCompare(b.value, 'en', { sensitivity: 'accent' })
      }

      if (a.state && !b.state) {
        return -1
      }

      return 1
    })

    return copy
  }

  const onCheckboxTagsChange = (checked: boolean, event: React.FormEvent<HTMLInputElement>) => {
    const target: EventTarget = event.target
    const state: boolean = (target as HTMLInputElement).checked
    const value: string = (target as HTMLInputElement).name

    const index: number = tagsData.findIndex((elem) => {
      return elem.value === value
    })

    const copy: FilterDataElem[] = [...tagsData]
    copy[index].state = state
    setTagsData(copy)
  }

  const onCheckboxTypesChange = (checked: boolean, event: React.FormEvent<HTMLInputElement>) => {
    const target: EventTarget = event.target
    const state: boolean = (target as HTMLInputElement).checked
    const value: string = (target as HTMLInputElement).name

    const index: number = typesData.findIndex((elem) => {
      return elem.value === value
    })

    const copy: FilterDataElem[] = [...typesData]
    copy[index].state = state
    setTypesData(copy)
  }

  const onSearchChange = (value: string) => {
    setTagSearch(value)
  }

  const onMoreClick = () => {
    setNumTags(numTags + 5)
  }

  const onLessClick = () => {
    if (numTags - 5 < 10) {
      setNumTags(10)
    } else {
      setNumTags(numTags - 5)
    }
  }

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h2}>Filters</Text>
      </TextContent>
      <Form isHorizontal>
        <FormGroup fieldId="type-selector" label="Types" hasNoPaddingTop>
          { typesData.map((type: FilterDataElem, index) => {
            return (
              <div className="mb-3" key={index}>
                <Checkbox
                  isChecked={type.state}
                  onChange={onCheckboxTypesChange}
                  key={index}
                  id={`types-${type.value}`}
                  label={type.value[0].toUpperCase() + type.value.slice(1)} // Label capitalizes first letter
                  name={type.value}
                />
              </div>
            )
          }) }
        </FormGroup>
        <FormGroup fieldId="tag-selector" label="Tags" hasNoPaddingTop>
          <SearchInput
            className="mb-3"
            placeholder='Find by tag name'
            value={tagSearch}
            onChange={onSearchChange}
            onClear={() => onSearchChange('')}
            resultsCount={tagsData.filter(tagData => tagData.value.toLowerCase().includes(tagSearch.toLowerCase())).length}
            />
          { tagsData.filter(tagData => tagData.value.toLowerCase().includes(tagSearch.toLowerCase())).slice(0, numTags).map((tag: FilterDataElem, index) => {
            return (
              <div className="mb-3" key={index}>
                <Checkbox
                  isChecked={tag.state}
                  onChange={onCheckboxTagsChange}
                  key={tag.value}
                  id={`types-${tag.value}`}
                  label={tag.value}
                  name={tag.value}
                  />
              </div>
            )
          }) }
          { numTags < tagsData.filter(tagData => tagData.value.toLowerCase().includes(tagSearch.toLowerCase())).length &&
            <a onClick={onMoreClick}>
              <TextContent>
                <Text>More...</Text>
              </TextContent>
            </a> }
          { numTags > baseNumTags &&
            <a onClick={onLessClick}>
              <TextContent>
                <Text>Less...</Text>
              </TextContent>
            </a> }
        </FormGroup>
      </Form>
    </>
  )
}

export default Filter
