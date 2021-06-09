module.exports = {
  mode: 'jit',
  purge: {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}']
  },
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        body: ['Red Hat Display']
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
