import type { Host } from 'custom-types';
import fs from 'fs';
import path from 'path';

const getConfigFileHosts = (fileRelPath: string): Host => {
  const splitRelFilePath = fileRelPath.split('/');
  const absFilePath = path.join(process.cwd(), ...splitRelFilePath);
  const hostsUnparsed = fs.readFileSync(absFilePath, 'utf8');
  const hosts = JSON.parse(hostsUnparsed) as Host;

  Object.values(hosts).forEach((host) => {
    if (host.stacks) {
      throw Error('The config file can only accept "url" for cypress tests');
    }
  });

  return hosts;
};

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
  let hosts: Host = getConfigFileHosts('/config/devfile-registry-hosts.json');
  hosts = { ...hosts, ...getENVHosts() };

  if (hosts.length > 1) {
    throw Error('The cypress tests can only accept 1 url');
  }

  const urls = Object.values(hosts).map((host) => host.url as string);

  return urls[0];
};
