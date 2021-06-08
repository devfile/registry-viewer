import type { FilterDataElem } from 'customTypes'
import type { Dispatch, SetStateAction } from 'react'

import { Checkbox, Form, FormGroup, FormSelect, FormSelectOption, Text, TextContent, TextVariants } from '@patternfly/react-core'
import { useState, useEffect, useRef } from 'react'

interface Props {
  tagsData: FilterDataElem[],
  typesData: FilterDataElem[],
  setTagsData: Dispatch<SetStateAction<FilterDataElem[]>>,
  setTypesData: Dispatch<SetStateAction<FilterDataElem[]>>
}

const Filter = ({ tagsData, typesData, setTagsData, setTypesData }: Props) => {
  const [tagOrder, setTagOrder] = useState<string>('name')

  useEffect(() => {
    const copy: FilterDataElem[] = tagsData.sort((a, b) => {
      if (a.state === b.state) {
        if (tagOrder === 'popularity') {
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
    setTagsData(tagsData => copy)

  }, [tagsData, tagOrder])

  useEffect(() => {
    setTypesData(typesData.sort((a, b) => {
      if (a.state == b.state) {
        return a.value.localeCompare(b.value, 'en', { sensitivity: 'accent' })
      }

      if (a.state && !b.state) {
        return -1
      }
      
      return 1
    }))

  }, [typesData])

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

  const onTagChange = (value: string) => {
    setTagOrder(value)
  }

  const tagSortOptions = [
    { value: 'please choose', label:'Please Choose', disabled: true },
    { value: 'name', label:'Name', disabled: false },
    { value: 'popularity', label:'Popularity', disabled: false }
  ]

  return (
    <>
    <TextContent>
      <Text component={TextVariants.h2}>Filters</Text>
    </TextContent>
    <Form isHorizontal>
      <FormGroup fieldId="type-selector" label="Types" isStack hasNoPaddingTop>
      <div style={{ height: '5rem', overflow: 'auto' }}>
        {typesData.map((type: FilterDataElem, index) => {
          return (
            <div style={{ marginBottom: '0.75rem' }} key={index}>
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
        <FormSelect id="tag-sort-options" value={tagOrder} onChange={onTagChange}>
          { tagSortOptions.map((option, index) => {
              return <FormSelectOption isDisabled={option.disabled} key={index} value={option.value} label={option.label}/>
          }) }
        </FormSelect>
      </FormGroup>
      <FormGroup fieldId="tag-selector" label="Tags" isStack hasNoPaddingTop>
        <div style={{ height: '25rem', overflow: 'auto' }}>
          { tagsData.map((tag: FilterDataElem, index) => {
            return (
              <div style={{ marginBottom: '0.75rem' }} key={index}>
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
