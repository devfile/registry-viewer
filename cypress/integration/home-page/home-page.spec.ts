/// <reference types="cypress" />

import type { Devfile, FilterDataElem } from 'custom-types'

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

const filterDevfilesOnTags = (devfiles: Devfile[], filteredTags: FilterDataElem[]): Devfile[] => {
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

const filterDevfilesOnTypes = (devfiles: Devfile[], filteredTypes: FilterDataElem[]): Devfile[] => {
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

describe('Pretests', () => {
  it('Verify webpage is running', () => {
    cy.visit('http://localhost:3000/')
  })
})

describe('Home page tests on desktop', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('http://localhost:3000/')
  })

  it('Devfile search bar', () => {
    cy.request('https://registry.devfile.io/index/all').then((response) => {
      const devfiles: Devfile[] = JSON.parse(response.body) as Devfile[]

      cy.get('[data-test-id^=card-]').should('have.length', devfiles.length)

      const textArr: string[] = ['JavA', 'rhel', 'PYTHON', 'vERT.x']

      textArr.forEach((text) => {
        cy.get('[data-test-id=search-bar-devfile]').type(`{selectall}{backspace}${text}`)
        cy.get('[data-test-id^=card-]').should('have.length', filterDevfilesOnSearch(devfiles, text).length)
      })
    })
  })

  it('Clickability of each devfile', () => {
    cy.request('https://registry.devfile.io/index/all').then((response) => {
      const devfiles: Devfile[] = JSON.parse(response.body) as Devfile[]

      devfiles.forEach((devfile) => {
        cy.get(`[data-test-id=card-${devfile.name.replace(/\.| /g, '')}]`).click()
        cy.get('[data-test-id=go-home-button').click()
      })
    })
  })

  it('Type filter', () => {
    cy.request('https://registry.devfile.io/index/all').then((response) => {
      const devfiles: Devfile[] = JSON.parse(response.body) as Devfile[]

      const typesMap: FilterDataElem[] = getSortedTypesAndFreq(devfiles)

      cy.get('[data-test-id^=type-]').should('have.length', typesMap.length)

      for (let numTypesSelected = 1; numTypesSelected <= typesMap.length; numTypesSelected++) {
        for (let i = 0; i + numTypesSelected <= typesMap.length; i++) {
          const filteredTypes: FilterDataElem[] = typesMap.slice(i, i + numTypesSelected)
          if (numTypesSelected === 1 || i !== 0) {
            cy.get(`[data-test-id=type-${filteredTypes[numTypesSelected - 1].value.replace(/\.| /g, '')}]`).click()
          } else {
            filteredTypes.forEach((type) => {
              cy.get(`[data-test-id=type-${type.value.replace(/\.| /g, '')}]`).click()
            })
          }

          cy.get('[data-test-id^=card-]').should('have.length', filterDevfilesOnTypes(devfiles, filteredTypes).length)

          if (numTypesSelected === 1 || i + numTypesSelected !== typesMap.length) {
            cy.get(`[data-test-id=type-${filteredTypes[0].value.replace(/\.| /g, '')}]`).click()
          } else {
            filteredTypes.forEach((type) => {
              cy.get(`[data-test-id=type-${type.value.replace(/\.| /g, '')}]`).click()
            })
          }
        }
      }
    })
  })

  it('Expandability and collapsibility of tag filter', () => {
    cy.get('[data-test-id=more-tags]').click()

    cy.get('[data-test-id=less-tags]').click()
  })

  it('Tag filter', () => {
    cy.request('https://registry.devfile.io/index/all').then((response) => {
      const devfiles: Devfile[] = JSON.parse(response.body) as Devfile[]

      const tagsMap: FilterDataElem[] = getSortedTagsAndFreq(devfiles)

      // Get the number of clicks required for maximum filter size
      const numTagFilterClicks = Math.ceil((tagsMap.length - 10) / 5)

      // Expand the tag filter to the maximum size
      for (let i = 0; i < numTagFilterClicks; i++) {
        cy.get('[data-test-id=more-tags]').click()
      }

      cy.get('[data-test-id^=tag-]').should('have.length', tagsMap.length)

      for (let numTagsSelected = 1; numTagsSelected <= tagsMap.length; numTagsSelected++) {
        for (let i = 0; i + numTagsSelected <= tagsMap.length; i++) {
          const filteredTags: FilterDataElem[] = tagsMap.slice(i, i + numTagsSelected)

          if (numTagsSelected === 1 || i !== 0) {
            cy.get(`[data-test-id=tag-${filteredTags[numTagsSelected - 1].value.replace(/\.| /g, '')}]`).click()
          } else {
            filteredTags.forEach((tag) => {
              cy.get(`[data-test-id=tag-${tag.value.replace(/\.| /g, '')}]`).click()
            })
          }

          cy.get('[data-test-id^=card-]').should('have.length', filterDevfilesOnTags(devfiles, filteredTags).length)

          if (numTagsSelected === 1 || i + numTagsSelected !== tagsMap.length) {
            cy.get(`[data-test-id=tag-${filteredTags[0].value.replace(/\.| /g, '')}]`).click()
          } else {
            filteredTags.forEach((tag) => {
              cy.get(`[data-test-id=tag-${tag.value.replace(/\.| /g, '')}]`).click()
            })
          }
        }
      }

      // Collapse the tag filter to the minimum size
      for (let i = 0; i < numTagFilterClicks; i++) {
        cy.get('[data-test-id=less-tags]').click()
      }
    })
  })

  it('Tag filter search bar', () => {
    cy.request('https://registry.devfile.io/index/all').then((response) => {
      const devfiles: Devfile[] = JSON.parse(response.body) as Devfile[]

      const tagsMap: FilterDataElem[] = getSortedTagsAndFreq(devfiles)

      // Get the number of clicks required for maximum filter size
      const numTagFilterClicks = Math.ceil((tagsMap.length - 10) / 5)

      // Expand the tag filter to the maximum size
      for (let i = 0; i < numTagFilterClicks; i++) {
        cy.get('[data-test-id=more-tags]').click()
      }

      const textArr: string[] = ['JavA', 'rhel', 'PYTHON', 'vERT.x']

      textArr.forEach((text) => {
        cy.get('[data-test-id=search-bar-tag]').type(`{selectall}{backspace}${text}`)
        cy.get('[data-test-id^=tag-]').should('have.length', tagsMap.filter(tagData => tagData.value.toLowerCase().includes(text.toLowerCase())).length)
      })

      // Collapse the tag filter to the minimum size
      for (let i = 0; i < numTagFilterClicks; i++) {
        cy.get('[data-test-id=less-tags]').click()
      }
    })
  })
})
