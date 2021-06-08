import type { TagElem, TypeElem, StringFreqMap } from 'customTypes'

import { Checkbox, Form, FormGroup, FormSelect, FormSelectOption, Text, TextContent, TextVariants } from '@patternfly/react-core'
import { useState, useEffect } from 'react'

interface Props {
  tagsMap: StringFreqMap,
  typesMap: StringFreqMap,
  checkboxTagsValues: TagElem[],
  checkboxTypesValues: TypeElem[],
  onCheckboxTagsChange: (checked: boolean, event: React.FormEvent<HTMLInputElement>) => void,
  onCheckboxTypesChange: (checked: boolean, event: React.FormEvent<HTMLInputElement>) => void,
}

interface ObjData {
  value: string,

}

const Filter = ({ tagsMap, typesMap, checkboxTagsValues, checkboxTypesValues, onCheckboxTagsChange, onCheckboxTypesChange }: Props) => {
  const [tagOrder, setTagOrder] = useState<string>('name')
  const [tagsShown, setTagsShown] = useState<string[]>(tagsMap.values)
  const [typesShown, setTypesShown] = useState<string[]>(typesMap.values)

  useEffect(() => {
    setTagsShown(() => {
      return tagsShown.sort((a, b) => {
        const aIsChecked = checkboxTagsValues.find((elem: TagElem) => { return elem.tag === a })?.value
        const bIsChecked = checkboxTagsValues.find((elem: TagElem) => { return elem.tag === b })?.value

        if (aIsChecked == bIsChecked) {
          if (tagOrder === 'popularity') {
      
          }
          return a.localeCompare(b)
        }

        if (aIsChecked && !bIsChecked) {
          return -1
        }
        
        return 1
      })
    })

  }, [checkboxTagsValues])

  useEffect(() => {
    setTypesShown(() => {
      return typesShown.sort((a, b) => {
        const aIsChecked = checkboxTypesValues.find((elem: TypeElem) => { return elem.type === a })?.value
        const bIsChecked = checkboxTypesValues.find((elem: TypeElem) => { return elem.type === b })?.value

        if (aIsChecked == bIsChecked) {
          return a.localeCompare(b)
        }

        if (aIsChecked && !bIsChecked) {
          return -1
        }
        
        return 1
      })
    })

  }, [checkboxTypesValues])

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
        {typesShown.map((type: string, index) => {
          return (
            <div style={{ marginBottom: '0.75rem' }} key={index}>
              <Checkbox
                isChecked={checkboxTypesValues.find((elem: TypeElem) => { return elem.type === type })?.value }
                onChange={onCheckboxTypesChange}
                key={index}
                id={`types-${type}`}
                label={type[0].toUpperCase() + type.slice(1)} // Label capitalizes first letter
                name={type}
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
          { tagsShown.map((tag: string, index) => {
            return (
              <div style={{ marginBottom: '0.75rem' }} key={index}>
                <Checkbox
                  isChecked={checkboxTagsValues.find((elem: TagElem) => { return elem.tag === tag })?.value }
                  onChange={onCheckboxTagsChange}
                  key={index}
                  id={`types-${tag}`}
                  label={tag}
                  name={tag}
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
