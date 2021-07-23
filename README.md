# registry-viewer

## UI for the Devfile Registry

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create next-app --example with-patternfly`](https://github.com/vercel/next.js/tree/canary/examples/with-patternfly).

## Next.js CLI

- [`next build`](https://nextjs.org/docs/api-reference/cli#build) creates an optimized production build of your application. The output displays information about each route.
- [`next dev`](https://nextjs.org/docs/api-reference/cli#development) starts the application in development mode with hot-code reloading, error reporting, and more.
- [`next start`](https://nextjs.org/docs/api-reference/cli#production) starts the application in production mode. The application should be compiled with next build first.

## Scripts

```json
"scripts": {
  "dev": "next",
  "build": "next build",
  "start": "next start",
  "clean": "rm -rf .next/ out/ node_modules/",
  "cypress:start": "concurrently --names 'CYPRESS,SERVER' --prefix-colors 'yellow,blue' \"yarn cypress open\" \"yarn build && yarn start\"",
  "typedoc:build": "node_modules/.bin/typedoc --tsconfig .",
  "typedoc:start": "npx serve docs",
  "jest:test": "jest --watchAll --verbose",
  "test": "cypress run",
  "lint": "prettier --check .",
  "format": "prettier --write .",
  "prepare": "husky install"
}
```

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

## Adding remote repositories

Notes:

- For devfile hosts (environment variable or config file) specify a remote url or a local folder structure and `index.json` that follows the `devfile/api` spec.
- You can have infinitely many sources as long as the name for the source repository is different.
- There are two types of source types, url and stacks.
  - url is for specifying a remote hosts.
  - stacks is for specifying a local hosts. NOTE: Stacks MUST have `index.json` under the root path specified, an example is below.

`/stacks`

```
+-- stacks
|   +-- java-maven
|       +-- devfile.yaml
|   +-- java-openliberty
|       +-- devfile.yaml
|   +-- index.json
```

`/config/index.json`

```json
[
  {
    "name": "java-maven",
    "version": "1.1.0",
    "displayName": "Maven Java",
    "description": "Upstream Maven and OpenJDK 11",
    "type": "stack",
    "tags": ["Java", "Maven"],
    "projectType": "maven",
    "language": "java",
    "links": {
      "self": "devfile-catalog/java-maven:latest"
    },
    "resources": ["devfile.yaml"],
    "starterProjects": ["springbootproject"]
  },
  {
    "name": "java-openliberty",
    "version": "0.5.0",
    "displayName": "Open Liberty",
    "description": "Java application stack using Open Liberty runtime",
    "type": "stack",
    "projectType": "docker",
    "language": "java",
    "links": {
      "self": "devfile-catalog/java-openliberty:latest"
    },
    "resources": ["devfile.yaml"],
    "starterProjects": ["user-app"]
  }
]
```

Configure the registry viewer through environment the variable.

`DEVFILE_REGISTRY_HOSTS`

Notes about environment variables:

- Each source MUST contain a name for the source repository, a source type (url or stacks), and a location and is split by ">". i.e. `name>type>location`
- Multiple sources are be split by "|". i.e. `name>type>location|name>type>location`

```
DEVFILE_REGISTRY_HOSTS="example1>url>https://registry.devfile.io|example2>stacks>/stacks"
```

Configure the registry viewer through config file.

`/config/devfile-registry-hosts.json`

```json
{
  "Example1": {
    "url": "https://registry.devfile.io"
  },
  "Example2": {
    "stacks": "/stacks"
  }
}
```

## Change the registry viewer base path

The environment variable `DEVFILE_VIEWER_ROOT` controls the registry viewer's base path and defaults to `/`.

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
