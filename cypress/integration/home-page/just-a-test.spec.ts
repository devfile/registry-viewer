/// <reference types="cypress" />

export {}

describe('First Tests', () => {
  it('This should succeed!', () => {
    expect(true).to.equal(true)
  })

  it('This should fail!', () => {
    expect(true).to.equal(false)
  })
})

describe('Access Website', () => {
  it('Visit Website', () => {
    cy.visit('http://localhost:3000/')
  })
  it('Click Basic NodeJS', () => {
    cy.visit('http://localhost:3000/')

    cy.contains('Basic NodeJS').click()
  })
})
