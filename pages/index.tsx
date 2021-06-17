import type { Devfile, FilterDataElem } from 'custom-types'
import Filter from '@components/home-page/Filter'
import DevfileSearchBar from '@components/home-page/DevfileSearchBar'
import DevfileGrid from '@components/home-page/DevfileGrid'

import { InferGetStaticPropsType, GetStaticProps } from 'next'
import { useState, useEffect } from 'react'
import { Grid, GridItem } from '@patternfly/react-core'

/**
 * Renders the {@link HomePage}
 */
const HomePage:React.FC<InferGetStaticPropsType<GetStaticProps>> = ({ devfiles, tagsMap, typesMap }: InferGetStaticPropsType<GetStaticProps>): React.ReactElement => {
  const [searchBarValue, setSearchBarValue] = useState<string>('')
  const [filteredDevfiles, setFilteredDevfiles] = useState<Devfile[]>(devfiles)

  const [tagsData, setTagsData] = useState<FilterDataElem[]>(tagsMap)
  const [typesData, setTypesData] = useState<FilterDataElem[]>(typesMap)

  /**
   * Test
   * @param devfiles-devfiles to be filtered upon
   * @param searchValue-search bar input
   * @returns Filtered devfiles based on the search bar input
   */
  const filterDevfilesOnSearch = (devfiles: Devfile[], searchValue: string): Devfile[] => {
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

  const filterDevfilesOnTags = (devfiles: Devfile[]): Devfile[] => {
    const filteredTags: FilterDataElem[] = tagsData.filter(tagData => tagData.state)

    if (!filteredTags.length) {
      return devfiles
    }

    const filteredOnTagDevfiles: Devfile[] = devfiles.filter((devfile: Devfile) => {
      let isSelected = false
      devfile.tags?.some((tag) => {
        filteredTags.some((filteredTag) => {
          if (tag === filteredTag.value) {
            isSelected = true
          }
          return isSelected
        })
        return isSelected
      })
      return isSelected
    })
    return filteredOnTagDevfiles
  }

  const filterDevfilesOnTypes = (devfiles: Devfile[]): Devfile[] => {
    const filteredTypes: FilterDataElem[] = typesData.filter(type => type.state)

    if (!filteredTypes.length) {
      return devfiles
    }

    const filteredOnTypeDevfiles: Devfile[] = devfiles.filter((devfile: Devfile) => {
      let isSelected = false
      filteredTypes.some((filteredType) => {
        if (devfile.type === filteredType.value) {
          isSelected = true
        }
        return isSelected
      })
      return isSelected
    })
    return filteredOnTypeDevfiles
  }

  useEffect(() => {
    const filteredOnSearchDevfiles = filterDevfilesOnSearch(devfiles, searchBarValue)
    const filteredOnTagDevfiles: Devfile[] = filterDevfilesOnTags(filteredOnSearchDevfiles)
    const filteredOnTypeDevfiles: Devfile[] = filterDevfilesOnTypes(filteredOnTagDevfiles)

    setFilteredDevfiles(filteredOnTypeDevfiles)
  }, [tagsData, typesData, searchBarValue])

  const onSearchBarChange = (value: string) => {
    setSearchBarValue(value)
  }

  return (
    <div>
      <Grid hasGutter>
        <GridItem xl2={3} xl={3} lg={4} md={6} sm={12}>
          <Filter
            tagsData={tagsData}
            typesData={typesData}
            setTagsData={setTagsData}
            setTypesData={setTypesData}
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

const getStringArrFreq = (arr: string[]): FilterDataElem[] => {
  const filterDataArr: FilterDataElem[] = []
  let prev = ''

  arr.sort((a, b) => { return a.localeCompare(b, 'en', { sensitivity: 'accent' }) })
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i] ?? null
    if (arr[i]) {
      if (arr[i] !== prev) {
        filterDataArr.push({ value: arr[i], state: false, freq: 1 })
      } else {
        filterDataArr[filterDataArr.length - 1].freq++
      }
      prev = arr[i]
    }
  }

  return filterDataArr
}

const getSortedTagsAndFreq = (devfiles: Devfile[]): FilterDataElem[] => {
  const tags: string[] = devfiles?.map((devfile) => {
    return devfile?.tags
  }).flat()

  const tagsMap: FilterDataElem[] = getStringArrFreq(tags)

  return tagsMap
}

const getSortedTypesAndFreq = (devfiles: Devfile[]): FilterDataElem[] => {
  const types: string[] = devfiles?.map((devfile) => {
    return devfile.type
  })

  const typesMap: FilterDataElem[] = getStringArrFreq(types)

  return typesMap
}

export const getStaticProps: GetStaticProps = async () => {
  const res: Response = await fetch('https://registry.devfile.io/index/all')
  let devfiles: Devfile[] = await res.json() as Devfile[]
  devfiles = devfiles.sort((a, b) => { return a.displayName.localeCompare(b.displayName, 'en', { sensitivity: 'accent' }) })

  const tagsMap: FilterDataElem[] = getSortedTagsAndFreq(devfiles)
  const typesMap: FilterDataElem[] = getSortedTypesAndFreq(devfiles)

  return {
    props: {
      devfiles,
      tagsMap,
      typesMap
    },
    revalidate: 21600 // Regenerate page every 6 hours
  }
}

export default HomePage
