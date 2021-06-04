import type { Devfile, TagElem, TypeElem } from 'customTypes'
import Filter from '@components/Filter'
import DevfileSearchBar from '@components/DevfileSearchBar'
import DevfileGrid from '@components/DevfileGrid'

import { InferGetStaticPropsType, GetStaticProps } from 'next'
import { useState, useEffect } from 'react'
import { Grid, GridItem } from '@patternfly/react-core'

const Home = ({ devfiles, types, tags }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [filterDevfiles, setFilterDevfiles] = useState<Devfile[]>(devfiles)

  const [checkboxTagsValues, setCheckboxTagsValues] = useState<TagElem[]>(tags.map((tag: string) => {
    return { tag: tag, value: false }
  }))
  const [checkboxTypesValues, setCheckboxTypesValues] = useState<TypeElem[]>(types.map((type: string) => {
    return { type: type, value: false }
  }))

  const filterDevfilesOnSearch = (devfiles: Devfile[], searchValue: string) => {
    if (searchValue === '') {
      return devfiles
    }

    const filteredOnSearchDevfiles: Devfile[] = devfiles.filter((devfile: Devfile) => {
      const searchedTags: string[] = devfile.tags?.filter((tag) => {
        return tag.toLowerCase().includes(searchValue.toLowerCase())
      })

      return (
        devfile.displayName.toLowerCase().includes(searchValue.toLowerCase()) || // Check the search value against the display name
        devfile.description?.toLowerCase().includes(searchValue.toLowerCase()) || // Check the search value against the description
        (searchedTags?.length > 0) // Check the search value against the tags
      )
    })
    return filteredOnSearchDevfiles
  }

  const filterDevfilesOnTags = (devfiles: Devfile[]) => {
    const filteredTags: TagElem[] = checkboxTagsValues.filter(tag => tag.value)

    if (!filteredTags.length) {
      return devfiles
    }

    const filteredOnTagDevfiles: Devfile[] = devfiles.filter((devfile: Devfile) => {
      let isSelected: boolean = false
      devfile.tags?.some((tag) => {
        filteredTags.some((filteredTag) => {
          if (tag === filteredTag.tag)
            return isSelected = true
        })
        return isSelected
      })
      return isSelected
    })
    return filteredOnTagDevfiles
  }

  const filterDevfilesOnTypes = (devfiles: Devfile[]) => {
    const filteredTypes: TypeElem[] = checkboxTypesValues.filter(type => type.value)

    if (!filteredTypes.length) {
      return devfiles
    }

    const filteredOnTypeDevfiles: Devfile[] = devfiles.filter((devfile: Devfile) => {
      let isSelected: boolean = false
      filteredTypes.some((filteredType) => {
        if (devfile.type === filteredType.type)
          return isSelected = true
      })
      return isSelected
    })
    return filteredOnTypeDevfiles
  }

  useEffect(() => {
    const filteredOnSearchDevfiles = filterDevfilesOnSearch(devfiles, searchValue)
    const filteredOnTagDevfiles: Devfile[] = filterDevfilesOnTags(filteredOnSearchDevfiles)
    const filteredOnTypeDevfiles: Devfile[] = filterDevfilesOnTypes(filteredOnTagDevfiles)

    setFilterDevfiles(filteredOnTypeDevfiles)

  }, [checkboxTagsValues, checkboxTypesValues, searchValue])

  const onCheckboxTagsChange = (checked: boolean, event: React.FormEvent<HTMLInputElement>) => {
    const target: EventTarget = event.target
    const value: boolean = (target as HTMLInputElement).checked
    const name: string = (target as HTMLInputElement).name
    const index: number = checkboxTagsValues.findIndex((elem) => {
      return elem.tag === name
    })
    
    const copy: TagElem[] = [...checkboxTagsValues]
    copy[index] = { tag: name, value }
    setCheckboxTagsValues(copy)
  }

  const onCheckboxTypesChange = (checked: boolean, event: React.FormEvent<HTMLInputElement>) => {
    const target: EventTarget = event.target
    const value: boolean = (target as HTMLInputElement).checked
    const name: string = (target as HTMLInputElement).name
    const index: number = checkboxTypesValues.findIndex((elem) => {
      return elem.type === name
    })

    const copy: TypeElem[] = [...checkboxTypesValues]
    copy[index] = { type: name, value }
    setCheckboxTypesValues(copy)
  }

  const onSearchChange = (value: string) => {
    setSearchValue(value)
  }

  return (
    <div style={{ padding: '1rem 4.5rem' }}>
      <Grid hasGutter>
        <GridItem span={3}>
          <Filter
            tags={tags}
            types={types}
            checkboxTagsValues={checkboxTagsValues}
            checkboxTypesValues={checkboxTypesValues}
            onCheckboxTagsChange={onCheckboxTagsChange}
            onCheckboxTypesChange={onCheckboxTypesChange}
          />
        </GridItem>
        <GridItem span={9}>
          <DevfileSearchBar count={filterDevfiles.length} onSearchChange={onSearchChange} searchValue={searchValue} />
          <DevfileGrid searchDevfiles={filterDevfiles} />
        </GridItem>
      </Grid>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res: Response = await fetch('https://registry.devfile.io/index/all')
  const devfiles: Devfile[] = await res.json()

  const types: string[] = devfiles?.map((devfile) => {
    return devfile.type
  }).filter((value, index, self) => { // remove duplicate values
    return self.indexOf(value) === index
  })

  const tags: string[] = devfiles?.map((devfile) => {
    return devfile?.tags
  }).reduce((acc, curVal) => { // flatten the array
    return acc.concat(curVal ?? null)
  }, []).filter((value, index, self) => { // remove duplicate values
    return self.indexOf(value) === index
  }).filter((tag) => { // remove null value
    return tag !== null
  })

  return {
    props: {
      devfiles,
      types,
      tags
    },
    revalidate: 21600 // Regenerate page every 6 hours
  }
}

export default Home
