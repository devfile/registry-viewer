import type { FilterDataElem } from 'custom-types'
import type { Dispatch, SetStateAction } from 'react'

import { capitalizeFirstLetter } from '@util/index'

import { Grid, GridItem, Checkbox, Form, FormGroup, SearchInput, Text, TextContent, TextVariants } from '@patternfly/react-core'
import { useState, useEffect } from 'react'

export interface FilterProps {
  tagsData: FilterDataElem[],
  typesData: FilterDataElem[],
  setTagsData: Dispatch<SetStateAction<FilterDataElem[]>>,
  setTypesData: Dispatch<SetStateAction<FilterDataElem[]>>
}

/**
 * Renders a {@link Filter} React component.
 * Adds a type and tag filter for devfiles
 * @returns `<Filter tagsData={tagsData} typesData={typesData} setTagsData={setTagsData} setTypesData={setTypesData}/>`
 */
const Filter: React.FC<FilterProps> = ({ tagsData, typesData, setTagsData, setTypesData }: FilterProps) => {
  const baseNumTags = 10
  const changeNumTagsBy = 5

  const [tagSearch, setTagSearch] = useState('')
  const [numTags, setNumTags] = useState(baseNumTags)

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

    console.log(`Tag Filter: ${value}-${state.toString()}`)

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

    console.log(`Type Filter: ${value}-${state.toString()}`)

    const copy: FilterDataElem[] = [...typesData]
    copy[index].state = state
    setTypesData(copy)
  }

  const onSearchChange = (value: string) => {
    setTagSearch(value)
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
            { typesData.map((type) => {
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
                value={tagSearch}
                onChange={onSearchChange}
                onClear={() => onSearchChange('')}
                resultsCount={tagsData.filter(tagData => tagData.value.toLowerCase().includes(tagSearch.toLowerCase())).length}
              />
            </GridItem>
            { tagsData.filter(tagData => tagData.value.toLowerCase().includes(tagSearch.toLowerCase())).slice(0, numTags).map((tag) => {
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
            { numTags < tagsData.filter(tagData => tagData.value.toLowerCase().includes(tagSearch.toLowerCase())).length &&
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

export default Filter
