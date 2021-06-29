# registry-viewer

## UI for the Devfile Registry

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create next-app --example with-patternfly`](https://github.com/vercel/next.js/tree/canary/examples/with-patternfly).

## Next.js CLI

- [`next build`](https://nextjs.org/docs/api-reference/cli#build) creates an optimized production build of your application. The output displays information about each route.
- [`next dev`](https://nextjs.org/docs/api-reference/cli#development) starts the application in development mode with hot-code reloading, error reporting, and more.
- [`next export`](https://nextjs.org/docs/advanced-features/static-html-export) allows you to export your app to static HTML, which can be run standalone without the need of a Node.js server.
- [`next start`](https://nextjs.org/docs/api-reference/cli#production) starts the application in production mode. The application should be compiled with next build first.

## Scripts

```json
"scripts": {
  "dev": "next",
  "build": "next build && next export",
  "start": "next start",
  "start-build": "yarn build & yarn start",
  "clean": "rm -rf .next/ out/ node_modules/",
  "cypress:start": "yarn run cypress open",
  "cypress:start-build": "concurrently --names 'CYPRESS,SERVER' --prefix-colors 'yellow,blue' \"yarn cypress:start\" \"yarn start-build\"",
  "typedoc:build": "node_modules/.bin/typedoc --tsconfig .",
  "typedoc:start": "npx serve docs"
}
```

- `dev` - Runs `next dev` which starts Next.js in development mode
- `build` - Runs `next build && next export` which builds the application for production usage
- `start` - Runs `next start` which starts a Next.js production server
- `start-build` - Runs `build` then `start`
- `clean` - Slims the directory
- `cypress:start` - Runs cypress as a standalone client
- `cypress:start-build` - Runs cypress concurrently with a production build
- `typedoc:build` - Runs typedoc to generate docs
- `typedoc:start` - Serves the docs

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Creating a Non-Production Build

Create an optimized production build of your application:

```bash
npm run build
# or
yarn build
```

## Serving a Non-Production Build

Start the application in production mode:

```bash
npm run start
# or
yarn start
```

## Deploying a Production Build

- [Next.js Deployment](https://nextjs.org/docs/deployment) - learn about Next.js deployment.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
