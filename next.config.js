const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa');
const withImages = require('next-images');
const withTM = require('next-transpile-modules')([
  '@patternfly/react-core',
  '@patternfly/react-styles',
]);

module.exports = withPlugins([withTM, withImages, withPWA], {
  images: {
    // Remove once next js is updated
    disableStaticImages: true,
  },
  pwa: {
    disable: process.env.NODE_ENV === 'development',
    register: true,
    dest: 'public',
  },
});
