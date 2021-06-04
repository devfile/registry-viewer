const withPlugins = require('next-compose-plugins')
const withPWA = require('next-pwa')
const withTM = require('next-transpile-modules')([
  '@patternfly/react-core',
  '@patternfly/react-styles'
])

module.exports = withPlugins([withTM, withPWA], {
  future: {
    webpack5: true
  },
  pwa: {
    dest: 'public'
  }
})
