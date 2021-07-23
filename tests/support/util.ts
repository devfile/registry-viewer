import type { Host } from 'custom-types';

const getENVHosts = () => {
  const envHosts = process.env.DEVFILE_REGISTRY_HOSTS?.split(',').filter((host) => host !== '');

  let hosts: Host = {};

  if (envHosts?.length) {
    envHosts.forEach((envHost) => {
      const [hostName, sourceType, hostLocation] = envHost.split('>');

      if (sourceType !== 'url') {
        throw Error(
          'The environment variable DEVFILE_REGISTRY_HOSTS can only accept "url" for cypress tests'
        );
      }

      hosts = {
        ...hosts,
        [hostName]: {
          [sourceType]: hostLocation
        }
      };
    });
  }

  return hosts;
};

export const getDevfileURLs = (): string => {
  const hosts: Host = getENVHosts();

  if (hosts.length > 1) {
    throw Error('The cypress tests can only accept 1 url');
  }

  const urls = Object.values(hosts).map((host) => host.url as string);

  if (!urls.length) {
    urls.push('https://registry.devfile.io/index/all');
  }

  return urls[0];
};
