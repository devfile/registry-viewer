import type { Devfile, FilterElem } from 'custom-types'
import DevfileFilter from '@components/home-page/DevfileFilter'
import DevfileSearchBar from '@components/home-page/DevfileSearchBar'
import DevfileGrid from '@components/home-page/DevfileGrid'

import { InferGetStaticPropsType, GetStaticProps } from 'next'
import { useState, useEffect } from 'react'
import { Grid, GridItem } from '@patternfly/react-core'

/**
 * Renders the {@link HomePage}
 */
const HomePage:React.FC<InferGetStaticPropsType<GetStaticProps>> = ({ devfiles, tags, types }: InferGetStaticPropsType<GetStaticProps>): React.ReactElement => {
  const [searchBarValue, setSearchBarValue] = useState<string>('')
  const [filteredDevfiles, setFilteredDevfiles] = useState<Devfile[]>(devfiles)

  const [tagsStateWithFreq, setTagsStateWithFreq] = useState<FilterElem[]>(tags)
  const [typesStateWithFreq, setTypesStateWithFreq] = useState<FilterElem[]>(types)

  useEffect(() => {
    let filteredDevfiles = filterDevfilesOnSearchBar(devfiles, searchBarValue)
    filteredDevfiles = filterDevfilesOnTags(filteredDevfiles, tagsStateWithFreq)
    filteredDevfiles = filterDevfilesOnTypes(filteredDevfiles, typesStateWithFreq)

    setFilteredDevfiles(filteredDevfiles)
  }, [tagsStateWithFreq, typesStateWithFreq, searchBarValue])

  const onSearchBarChange = (value: string) => {
    setSearchBarValue(value)
  }

  return (
    <div>
      <Grid hasGutter>
        <GridItem xl2={3} xl={3} lg={4} md={6} sm={12}>
          <DevfileFilter
            tagsStateWithFreq={tagsStateWithFreq}
            typesStateWithFreq={typesStateWithFreq}
            setTagsStateWithFreq={setTagsStateWithFreq}
            setTypesStateWithFreq={setTypesStateWithFreq}
          />
        </GridItem>
        <GridItem xl2={9} xl={9} lg={8} md={6} sm={12}>
          <DevfileSearchBar devfileCount={filteredDevfiles.length} onSearchBarChange={onSearchBarChange} searchBarValue={searchBarValue} />
          <DevfileGrid devfiles={filteredDevfiles} />
        </GridItem>
      </Grid>
    </div>
  )
}

const isSearchBarValueIn = (value: string | undefined, searchBarValue: string) => {
  return value?.toLowerCase().includes(searchBarValue.toLowerCase())
}

const isSearchBarValueInTag = (tags: string[] | undefined, searchBarValue: string) => {
  return tags?.some((tag) => (tag.toLowerCase().includes(searchBarValue.toLowerCase())))
}

const filterDevfilesOnSearchBar = (devfiles: Devfile[], searchBarValue: string): Devfile[] => {
  if (searchBarValue === '') {
    return devfiles
  }

  const devfilesFilteredOnSearchBar: Devfile[] = devfiles.filter((devfile: Devfile) => {
    if (isSearchBarValueIn(devfile.displayName, searchBarValue)) {
      return true
    }

    if (isSearchBarValueIn(devfile.description, searchBarValue)) {
      return true
    }

    return isSearchBarValueInTag(devfile.tags, searchBarValue)
  })
  return devfilesFilteredOnSearchBar
}

const filterDevfilesOnTags = (devfiles: Devfile[], tagsStateWithFreq: FilterElem[]): Devfile[] => {
  const tagsSelectedByUser: FilterElem[] = tagsStateWithFreq.filter(tag => tag.state)

  if (!tagsSelectedByUser.length) {
    return devfiles
  }

  const devfilesFilteredOnTags: Devfile[] = devfiles.filter((devfile: Devfile) => {
    return devfile.tags?.some((tag) => {
      return tagsSelectedByUser.some((tagSelectedByUser) => (tag === tagSelectedByUser.value))
    })
  })
  return devfilesFilteredOnTags
}

const filterDevfilesOnTypes = (devfiles: Devfile[], typesStateWithFreq: FilterElem[]): Devfile[] => {
  const typesSelectedByUser: FilterElem[] = typesStateWithFreq.filter(type => type.state)

  if (!typesSelectedByUser.length) {
    return devfiles
  }

  const devfilesFilteredOnTypes: Devfile[] = devfiles.filter((devfile: Devfile) => {
    return typesSelectedByUser.some((typeSelectedByUser) => (devfile.type === typeSelectedByUser.value))
  })
  return devfilesFilteredOnTypes
}

const getStateAndStringFreq = (arr: string[]): FilterElem[] => {
  const filterElemArr: FilterElem[] = []
  let prev = ''

  arr.sort((a, b) => { return a.localeCompare(b, 'en', { sensitivity: 'accent' }) })
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i] ?? null
    if (arr[i]) {
      if (arr[i] !== prev) {
        filterElemArr.push({ value: arr[i], state: false, freq: 1 })
      } else {
        filterElemArr[filterElemArr.length - 1].freq++
      }
      prev = arr[i]
    }
  }

  return filterElemArr
}

const getTagsStateWithFreq = (devfiles: Devfile[]): FilterElem[] => {
  const tagValues: string[] = devfiles?.map((devfile) => (devfile?.tags)).flat()

  const tagsStateWithFreq: FilterElem[] = getStateAndStringFreq(tagValues)

  return tagsStateWithFreq
}

const getTypesStateWithFreq = (devfiles: Devfile[]): FilterElem[] => {
  const typeValues: string[] = devfiles?.map((devfile) => (devfile.type))

  const tagsStateWithFreq: FilterElem[] = getStateAndStringFreq(typeValues)

  return tagsStateWithFreq
}

export const getStaticProps: GetStaticProps = async () => {
  const res: Response = await fetch('https://registry.devfile.io/index/all?icon=base64')
  let devfiles: Devfile[] = await res.json() as Devfile[]
  devfiles = devfiles.sort((a, b) => { return a.displayName.localeCompare(b.displayName, 'en', { sensitivity: 'accent' }) })

  const tags: FilterElem[] = getTagsStateWithFreq(devfiles)
  const types: FilterElem[] = getTypesStateWithFreq(devfiles)

  return {
    props: {
      devfiles,
      tags,
      types
    },
    revalidate: 21600 // Regenerate page every 6 hours
  }
}

export default HomePage
