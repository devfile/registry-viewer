import type { TagElem, TypeElem } from 'customTypes'

import { Checkbox, Form, FormGroup, Text, TextContent, TextVariants } from '@patternfly/react-core'
import { useState } from 'react'

interface Props {
  tags: string[],
  types: string[],
  checkboxTagsValues: TagElem[],
  checkboxTypesValues: TypeElem[],
  onCheckboxTagsChange: (checked: boolean, event: React.FormEvent<HTMLInputElement>) => void,
  onCheckboxTypesChange: (checked: boolean, event: React.FormEvent<HTMLInputElement>) => void,
}

const Filter = ({ tags, types, checkboxTagsValues, checkboxTypesValues, onCheckboxTagsChange, onCheckboxTypesChange }: Props) => {
  const [numTagsShown, setNumTagsShown] = useState<number>(10)
  const [numTypesShown, setNumTypesShown] = useState<number>(10)

  const onTagsExpand = () => {
    setNumTagsShown(numTagsShown + 5)
  }

  const onTagsDecrease = () => {
    if (numTagsShown - 5 < 10) {
      setNumTagsShown(10)
    }
    else {
      setNumTagsShown(numTagsShown - 5)
    }
  }

  const onTypesExpand = () => {
    setNumTypesShown(numTypesShown + 5)
  }

  const onTypesDecrease = () => {
    if (numTypesShown - 5 < 10) {
      setNumTypesShown(10)
    }
    else {
      setNumTypesShown(numTypesShown - 5)
    }
  }

  return (
    <>
    <TextContent>
      <Text component={TextVariants.h2}>Filters</Text>
    </TextContent>
    <Form isHorizontal>
      <FormGroup fieldId="type-selector" label="Types" isStack hasNoPaddingTop>
        {types.slice(0, numTypesShown).map((type: string) => {
          return (
            <Checkbox
              isChecked={checkboxTypesValues.find((elem: TypeElem) => { return elem.type === type })?.value }
              onChange={onCheckboxTypesChange}
              key={type}
              id={`types-${type}`}
              label={type[0].toUpperCase() + type.slice(1)} // Label capitalizes first letter
              name={type}
            />
          )
        }) }
        {numTypesShown > 10 && <a onClick={onTypesDecrease}>Decrease...</a> }
        {numTypesShown < types.length && <a onClick={onTypesExpand}>Expand...</a> }
      </FormGroup>
      <FormGroup fieldId="tag-selector" label="Tags" isStack hasNoPaddingTop>
        { tags.slice(0, numTagsShown).map((tag: string) => {
          return (
            <Checkbox
              isChecked={checkboxTagsValues.find((elem: TagElem) => { return elem.tag === tag })?.value }
              onChange={onCheckboxTagsChange}
              key={tag}
              id={`types-${tag}`}
              label={tag}
              name={tag}
            />
          )
        }) }
        {numTagsShown > 10 && <a onClick={onTagsDecrease}>Decrease...</a> }
        {numTagsShown < tags.length && <a onClick={onTagsExpand}>Expand...</a> }
      </FormGroup>
    </Form>
    </>
  )
}

export default Filter
