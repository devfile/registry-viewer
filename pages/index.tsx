import type { Devfile, TagElem, TypeElem, StringFreqMap } from 'customTypes'
import Filter from '@components/home_page/Filter'
import DevfileSearchBar from '@components/home_page/DevfileSearchBar'
import DevfileGrid from '@components/home_page/DevfileGrid'

import { InferGetStaticPropsType, GetStaticProps } from 'next'
import { useState, useEffect } from 'react'
import { Grid, GridItem } from '@patternfly/react-core'

const Home = ({ devfiles, tagsMap, typesMap }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [filteredDevfiles, setFilteredDevfiles] = useState<Devfile[]>(devfiles)

  const [checkboxTagsValues, setCheckboxTagsValues] = useState<TagElem[]>(tagsMap.values.map((tag: string) => {
    return { tag: tag, value: false }
  }))
  const [checkboxTypesValues, setCheckboxTypesValues] = useState<TypeElem[]>(typesMap.values.map((type: string) => {
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

    setFilteredDevfiles(filteredOnTypeDevfiles)

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
            tagsMap={tagsMap}
            typesMap={typesMap}
            checkboxTagsValues={checkboxTagsValues}
            checkboxTypesValues={checkboxTypesValues}
            onCheckboxTagsChange={onCheckboxTagsChange}
            onCheckboxTypesChange={onCheckboxTypesChange}
          />
        </GridItem>
        <GridItem span={9}>
          <DevfileSearchBar count={filteredDevfiles.length} onSearchChange={onSearchChange} searchValue={searchValue} />
          <DevfileGrid searchDevfiles={filteredDevfiles} />
        </GridItem>
      </Grid>
    </div>
  )
}

const getStringArrFreq = (arr: string[]) => {
  let tags: string[] = []
  let freq: number[] = []
  let prev: string = ''

  arr.sort();
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i] ?? null
    if (arr[i]) {
      if (arr[i] !== prev) {
        tags.push(arr[i]);
        freq.push(1);
      } else {
        freq[freq.length - 1]++;
      }
      prev = arr[i];
    }
  }

  return { values: tags, freq: freq }
}

const getSortedTagsAndFreq = (devfiles: Devfile[]) => {
  const tags: string[] = devfiles?.map((devfile) => {
    return devfile?.tags
  }).flat()

  const tagsMap: StringFreqMap = getStringArrFreq(tags)

  return tagsMap
}

const getSortedTypes = (devfiles: Devfile[]) => {
  const types: string[] = devfiles?.map((devfile) => {
    return devfile.type
  })

  const typesMap: StringFreqMap = getStringArrFreq(types)

  return typesMap
}

export const getStaticProps: GetStaticProps = async () => {
  const res: Response = await fetch('https://registry.devfile.io/index/all')
  let devfiles: Devfile[] = await res.json()
  devfiles = devfiles.sort((a, b) => { return a.displayName.localeCompare(b.displayName) })

  const tagsMap: StringFreqMap = getSortedTagsAndFreq(devfiles)
  const typesMap: StringFreqMap = getSortedTypes(devfiles)

  return {
    props: {
      devfiles,
      tagsMap,
      typesMap
    },
    revalidate: 21600 // Regenerate page every 6 hours
  }
}

export default Home
