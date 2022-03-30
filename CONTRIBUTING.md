# Contributing

Contributions are welcome!

## Code of Conduct

Before contributing to this repository for the first time, please review our project's [Code of Conduct](https://github.com/devfile/api/blob/main/CODE_OF_CONDUCT.md).

## Getting Started

### Issues

- Issues are tracked via the the [devfile/api](https://github.com/devfile/api) repo. Open or search for [issues](https://github.com/devfile/api/issues) with the label `area/registry`.

- If a related issue doesn't exist, you can open a new issue using a relevant [issue form](https://github.com/devfile/api/issues/new/choose). You can tag issues with `/area registry`.

### Development

#### Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

#### Creating a Production Build

Create an optimized production build of your application:

```bash
npm run build
# or
yarn build
```

#### Serving a Production Build

Start the application in production mode:

```bash
npm run start
# or
yarn start
```

### Adding remote repositories

Notes:

- For devfile hosts (environment variable or config file) specify a remote url or a local directory structure and `index.json` that follows the `devfile/api` spec.
- You can have infinitely many sources as long as the name for the source repository is different.
- There are two types of source types, url and local.
  - url is for specifying a remote hosts.
  - local is for specifying a local hosts. NOTE: Local MUST have `index.json` under the root path specified, an example is below.
- The "alias" property is optional and can only be assigned if using the "url" property.
- An alias is only recommended if the "url" property is assigned a localhost address. If no alias is specified the share button will use the "url" property.
- The link for the share button will not work if "local" is specified.

`/devfiles`

```
+-- devfiles
|   +-- java-maven
|       +-- devfile.yaml
|   +-- java-openliberty
|       +-- devfile.yaml
|   +-- index.json
```

`/**/index.json`

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

Notes about environment variable:

- The value assigned to the environment variable must be surrounded by quotes.
- Each source MUST contain a name for the source repository, a source type (url or local), and a location.
- A source is split by ">". i.e. `name>type>location>alias`
- Multiple sources are be split by "|". i.e. `name>type>location>alias|name>type>location`

```
DEVFILE_REGISTRY_HOSTS="example1>url>localhost:8080>https://registry.devfile.io|example2>local>/devfiles"
```

Configure the registry viewer through config file.

`/config/devfile-registry-hosts.json`

```json
{
  "Example1": {
    "url": "https://registry.devfile.io"
  },
  "Example2": {
    "url": "localhost:8080",
    "alias": "https://registry.devfile.io"
  },
  "Example3": {
    "local": "/devfiles"
  }
}
```

### Environment Variables

You can add local environment variables by creating an `.env.local` file in the root registry viewer directory to store the environment variables.

The environment variable `DEVFILE_VIEWER_ROOT` controls the registry viewer's base path. Note: Defaults to `/`.

The environment variable `DEVFILE_COMMUNITY_HOST` controls whether the registry viewer uses the community registry. Note: Defaults to `true` and any value assigned will be `false`.

The environment variable `DEVFILE_BANNER` controls whether the registry viewer banner is displayed. Note: Defaults to `true` and any value assigned will be `false`.

The environment variable `ANALYTICS_WRITE_KEY` is the Segment write key. Note: Defaults to `null`.

### Pull Requests

All commits must be signed off with the footer:

```
Signed-off-by: First Lastname <email@email.com>
```

Once you set your `user.name` and `user.email` in your git config, you can sign your commit automatically with `git commit -s`. When you think the code is ready for review, create a pull request and link the issue associated with it.

Owners of the repository will watch out for and review new PRs.

If comments have been given in a review, they have to be addressed before merging.

After addressing review comments, don’t forget to add a comment in the PR afterward, so everyone gets notified by Github and knows to re-review.
