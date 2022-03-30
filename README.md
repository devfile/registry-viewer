# registry-viewer

## Devfile Registry UI

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create next-app --example with-patternfly`](https://github.com/vercel/next.js/tree/canary/examples/with-patternfly).

## Quickstart

1. Fork this repository and clone it to your local device.

1. Create a new branch:
   ```
   git checkout -b MY_BRANCH_NAME
   ```
1. Install yarn:
   ```
   npm install -g yarn
   ```
1. Install the dependencies with:
   ```
   yarn
   ```
1. Start developing and watch for code changes:
   ```
   yarn dev
   ```

## Scripts

```json
"scripts": {
  "analyze": "cross-env ANALYZE=true next build",
  "dev": "next",
  "build": "next build",
  "start": "next start",
  "clean": "rimraf .next/ .nyc_output/ coverage/ docs/ out/ node_modules/",
  "cypress:start": "concurrently --names 'CYPRESS,SERVER' --prefix-colors 'yellow,blue' \"yarn cypress open\" \"yarn build && yarn start\"",
  "typedoc:build": "typedoc --tsconfig .",
  "typedoc:start": "npx serve docs",
  "jest:test": "jest --watchAll --verbose",
  "test": "cypress run",
  "lint": "prettier --check .",
  "format": "prettier --write .",
  "prepare": "husky install"
}
```

- `analyze` - Runs `next build` and analyzes the webpack bundle size
- `dev` - Runs `next dev` which starts Next.js in development mode
- `build` - Runs `next build` which builds the application for production usage
- `start` - Runs `next start` which starts a Next.js production server
- `clean` - Slims the directory
- `cypress:start` - Runs cypress concurrently with a production build
- `typedoc:build` - Runs typedoc to generate docs
- `typedoc:start` - Serves the docs
- `jest:test` - Runs all jest tests
- `test` - Runs all cypress and jest tests
- `lint` - Checks the formatting of all files
- `format` - Formats all files
- `prepare` - System script for auto formatting before committing

## Contributing

Please see our [contributing.md](https://github.com/devfile/registry-viewer/blob/main/CONTRIBUTING.md).

## License

Apache License 2.0, see [LICENSE](https://github.com/devfile/registry-viewer/blob/main/LICENSE) for details.