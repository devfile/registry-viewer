import type { FilterElem } from 'custom-types'
import type { Dispatch, SetStateAction } from 'react'

import { capitalizeFirstLetter } from '@util/index'

import { Grid, GridItem, Checkbox, Form, FormGroup, SearchInput, Text, TextContent, TextVariants } from '@patternfly/react-core'
import { useState, useEffect } from 'react'

export interface DevfileFilterProps {
  tagsStateWithFreq: FilterElem[],
  typesStateWithFreq: FilterElem[],
  setTagsStateWithFreq: Dispatch<SetStateAction<FilterElem[]>>,
  setTypesStateWithFreq: Dispatch<SetStateAction<FilterElem[]>>
}

/**
 * Renders a {@link Filter} React component.
 * Adds a type and tag filter for devfiles
 * @returns `<DevfileFilter tagsData={tagsData} typesData={typesData} setTagsData={setTagsData} setTypesData={setTypesData}/>`
 */
const DevfileFilter: React.FC<DevfileFilterProps> = ({ tagsStateWithFreq, typesStateWithFreq, setTagsStateWithFreq, setTypesStateWithFreq }: DevfileFilterProps) => {
  const baseNumTags = 10
  const changeNumTagsBy = 5

  const [tagSearchBarValue, setTagSearchBarValue] = useState('')
  const [numTags, setNumTags] = useState(baseNumTags)

  useEffect(() => {
    setTagsStateWithFreq(sortFilterDataArr(tagsStateWithFreq))
  }, [tagsStateWithFreq])

  const onCheckboxTagsChange = (checked: boolean, event: React.FormEvent<HTMLInputElement>) => {
    const target: EventTarget = event.target
    const state: boolean = (target as HTMLInputElement).checked
    const value: string = (target as HTMLInputElement).name

    const index: number = tagsStateWithFreq.findIndex((elem) => {
      return elem.value === value
    })

    console.log(`Tag Filter: ${value}-${state.toString()}`)

    const copy: FilterElem[] = [...tagsStateWithFreq]
    copy[index].state = state
    setTagsStateWithFreq(copy)
  }

  const onCheckboxTypesChange = (checked: boolean, event: React.FormEvent<HTMLInputElement>) => {
    const target: EventTarget = event.target
    const state: boolean = (target as HTMLInputElement).checked
    const value: string = (target as HTMLInputElement).name

    const index: number = typesStateWithFreq.findIndex((elem) => {
      return elem.value === value
    })

    console.log(`Type Filter: ${value}-${state.toString()}`)

    const copy: FilterElem[] = [...typesStateWithFreq]
    copy[index].state = state
    setTypesStateWithFreq(copy)
  }

  const onSearchChange = (value: string) => {
    setTagSearchBarValue(value)
  }

  const onMoreClick = () => {
    setNumTags(numTags + changeNumTagsBy)
  }

  const onLessClick = () => {
    if (numTags - changeNumTagsBy < baseNumTags) {
      setNumTags(baseNumTags)
    } else {
      setNumTags(numTags - changeNumTagsBy)
    }
  }

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h2}>Filters</Text>
      </TextContent>
      <Form isHorizontal>
        <FormGroup fieldId="type-selector" label="Types" hasNoPaddingTop>
          <Grid hasGutter>
            { typesStateWithFreq.map((type) => {
              return (
                <GridItem md={12} sm={3} key={type.value}>
                  <Checkbox
                    data-test-id={`type-${type.value.replace(/\.| /g, '')}`}
                    isChecked={type.state}
                    onChange={onCheckboxTypesChange}
                    id={`types-${type.value}`}
                    label={capitalizeFirstLetter(type.value)}
                    name={type.value}
                    />
                </GridItem>
              )
            }) }
          </Grid>
        </FormGroup>
        <FormGroup fieldId="tag-selector" label="Tags" hasNoPaddingTop>
          <Grid hasGutter>
            <GridItem span={12}>
              <SearchInput
                data-test-id="search-bar-tag"
                placeholder='Find by tag name'
                value={tagSearchBarValue}
                onChange={onSearchChange}
                onClear={() => onSearchChange('')}
                resultsCount={getFilterResultCount(tagsStateWithFreq, tagSearchBarValue)}
              />
            </GridItem>
            { tagsStateWithFreq.filter(tagData => tagData.value.toLowerCase().includes(tagSearchBarValue.toLowerCase())).slice(0, numTags).map((tag) => {
              return (
                <GridItem md={12} sm={3} key={tag.value}>
                  <Checkbox
                    data-test-id={`tag-${tag.value.replace(/\.| /g, '')}`}
                    isChecked={tag.state}
                    onChange={onCheckboxTagsChange}
                    id={`types-${tag.value}`}
                    label={tag.value}
                    name={tag.value}
                    />
                </GridItem>
              )
            }) }
            { numTags < getFilterResultCount(tagsStateWithFreq, tagSearchBarValue) &&
              <a onClick={onMoreClick} data-test-id="more-tags">
                <TextContent>
                  <Text>More...</Text>
                </TextContent>
              </a> }
            { numTags > baseNumTags &&
              <a onClick={onLessClick} data-test-id="less-tags">
                <TextContent>
                  <Text>Less...</Text>
                </TextContent>
              </a> }
          </Grid>
        </FormGroup>
      </Form>
    </>
  )
}

const sortFilterDataArr = (tagsStateWithFreq: FilterElem[]): FilterElem[] => {
  const copy: FilterElem[] = tagsStateWithFreq.sort((a, b) => {
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

const getFilterResultCount = (filterElemArr: FilterElem[], searchBarValue: string) => {
  return filterElemArr.filter(filterElem => filterElem.value.toLowerCase().includes(searchBarValue.toLowerCase())).length
}

export default DevfileFilter
