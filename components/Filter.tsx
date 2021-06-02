import type { TagElem, TypeElem } from 'customTypes'

import { Checkbox, Form, FormGroup, Text, TextContent, TextVariants } from '@patternfly/react-core'

interface Props {
  tags: string[],
  types: string[],
  checkboxTagsValues: TagElem[],
  checkboxTypesValues: TypeElem[],
  onCheckboxTagsChange: (checked: boolean, event: React.FormEvent<HTMLInputElement>) => void,
  onCheckboxTypesChange: (checked: boolean, event: React.FormEvent<HTMLInputElement>) => void,
}

const Filter = ({ tags, types, checkboxTagsValues, checkboxTypesValues, onCheckboxTagsChange, onCheckboxTypesChange }: Props) => {
  return (
    <>
    <TextContent>
      <Text component={TextVariants.h2}>Filters</Text>
    </TextContent>
    <Form isHorizontal>
      <FormGroup fieldId="type-selector" label="Types" isStack hasNoPaddingTop>
        {types.map((type: string) => {
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
        })}
      </FormGroup>
      <FormGroup fieldId="tag-selector" label="Tags" isStack hasNoPaddingTop>
        { tags.map((tag: string) => {
          return (
            <Checkbox
              isChecked={checkboxTagsValues.find((elem: TagElem) => { return elem.tag === tag })?.value }
              onChange={onCheckboxTagsChange}
              key={tag}
              id={`types-${tag}`}
              label={tag}
              name={tag}
            /> // Label capitalizes first letter
          )
        }) }
      </FormGroup>
    </Form>
    </>
  )
}

export default Filter
