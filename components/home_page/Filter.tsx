import type { FilterDataElem } from 'customTypes'
import type { Dispatch, SetStateAction } from 'react'

import { Checkbox, Form, FormGroup, FormSelect, FormSelectOption, Text, TextContent, TextVariants } from '@patternfly/react-core'
import { useState, useEffect } from 'react'

interface Props {
  tagsData: FilterDataElem[],
  typesData: FilterDataElem[],
  setTagsData: Dispatch<SetStateAction<FilterDataElem[]>>,
  setTypesData: Dispatch<SetStateAction<FilterDataElem[]>>
}

enum TagOrder {
  POPULARITY = 'popularity',
  NAME = 'name'
}

const Filter = ({ tagsData, typesData, setTagsData, setTypesData }: Props): React.ReactElement => {
  const [tagOrder, setTagOrder] = useState<TagOrder>(TagOrder.NAME)

  useEffect(() => {
    setTypesData(sortTypes(typesData))
  }, [typesData])

  useEffect(() => {
    setTagsData(sortTags(tagsData, tagOrder))
  }, [tagsData, tagOrder])

  const sortTags = (tagsData: FilterDataElem[], tagOrder: TagOrder): FilterDataElem[] => {
    const copy: FilterDataElem[] = tagsData.sort((a, b) => {
      if (a.state === b.state) {
        if (tagOrder === TagOrder.POPULARITY) {
          if (b.freq - a.freq) {
            return b.freq - a.freq
          }

          return a.value.localeCompare(b.value, 'en', { sensitivity: 'accent' })
        }

        return a.value.localeCompare(b.value, 'en', { sensitivity: 'accent' })
      }

      if (a.state && !b.state) {
        return -1
      }
      return 1
    })

    return copy
  }

  const sortTypes = (typesData: FilterDataElem[]): FilterDataElem[] => {
    const copy: FilterDataElem[] = typesData.sort((a, b) => {
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

  const onTagOrderChange = (value: string) => {
    const tagOrder = value as TagOrder
    setTagOrder(tagOrder)
    setTagsData(sortTags(tagsData, tagOrder))
  }

  const tagSortOptions = [
    { value: 'please choose', label: 'Please Choose', disabled: true },
    { value: TagOrder.NAME, label: 'Name', disabled: false },
    { value: TagOrder.POPULARITY, label: 'Popularity', disabled: false }
  ]

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h2}>Filters</Text>
      </TextContent>
      <Form isHorizontal>
        <FormGroup fieldId="type-selector" label="Types" isStack hasNoPaddingTop>
        <div className="h-auto overflow-auto">
          {typesData.map((type: FilterDataElem, index) => {
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
        </div>
        </FormGroup>
        <FormGroup fieldId="tag-sort-selector" label="Sort Tags by" isStack hasNoPaddingTop>
          <FormSelect id="tag-sort-options" value={tagOrder} onChange={onTagOrderChange}>
            { tagSortOptions.map((option, index) => {
              return <FormSelectOption isDisabled={option.disabled} key={index} value={option.value} label={option.label}/>
            }) }
          </FormSelect>
        </FormGroup>
        <FormGroup fieldId="tag-selector" label="Tags" isStack hasNoPaddingTop>
          <div className="h-2/3 overflow-auto">
            { tagsData.map((tag: FilterDataElem, index) => {
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
          </div>
        </FormGroup>
      </Form>
    </>
  )
}

export default Filter
