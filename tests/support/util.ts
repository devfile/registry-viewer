import type { HostList, HostURL } from 'custom-types';
import { is } from 'typescript-is';

const getENVHosts = (): HostList => {
  const envHosts = process.env.DEVFILE_REGISTRY_HOSTS?.split(',').filter((host) => host !== '');

  let hosts: HostList = {};

  if (envHosts?.length) {
    envHosts.forEach((envHost) => {
      const [hostName, sourceType, hostLocation] = envHost.split('>');

      hosts = {
        ...hosts,
        [hostName]: {
          [sourceType]: hostLocation
        }
      };
    });
  }

  Object.keys(hosts).forEach((host) => {
    if (!is<HostURL>(host)) {
      throw Error(`The ${location} can only accept "url" or "stacks"`);
    }
  });

  return hosts;
};

export const getDevfileURLs = (): string => {
  const hosts: HostList = getENVHosts();

  if (Object.values(hosts).length > 1) {
    throw Error('The cypress tests can only accept 1 url');
  }

  const urls = Object.values(hosts).map((host) => {
    if (is<HostURL>(host)) {
      return `${host.url}/index/all`;
    }
  }) as string[];

  if (!urls.length) {
    urls.push('https://registry.stage.devfile.io/index/all');
  }

  return urls[0];
};
