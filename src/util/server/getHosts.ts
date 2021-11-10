import type { HostList, GetHosts } from 'custom-types';
import { asyncTryCatch } from '@src/util/server';
import { promises as fs } from 'fs';
import path from 'path';
import { is } from 'typescript-is';

/**
 * The default host
 */
const Community = {
  url: 'https://registry.stage.devfile.io',
};

/**
 * Gets the hosts from the config file
 *
 * @param fileRelPath - the config file directory
 *
 * @returns a HostList
 */
export const getConfigFileHosts = async (fileRelPath: string): Promise<HostList> => {
  const splitRelFilePath = fileRelPath.split('/');
  const absFilePath = path.join(process.cwd(), ...splitRelFilePath);
  const hostsUnparsed = await fs.readFile(absFilePath, 'utf8');
  const hosts = JSON.parse(hostsUnparsed) as HostList;

  if (!is<HostList>(hosts)) {
    throw TypeError('The config file can only accept "url" or "local"');
  }

  return hosts;
};

/**
 *  Gets the hosts from the environment variable DEVFILE_REGISTRY_HOSTS
 *
 * @returns a HostList
 */
export const getENVHosts = (): HostList => {
  const envHosts = process.env.DEVFILE_REGISTRY_HOSTS?.split('|').filter((host) => host !== '');

  let hosts: HostList = {};

  if (envHosts?.length) {
    envHosts.forEach((envHost) => {
      const [hostName, sourceType, hostLocation, alias] = envHost.split('>');

      if (alias) {
        hosts = {
          ...hosts,
          [hostName]: {
            [sourceType]: hostLocation,
            alias,
          },
        };
      } else {
        hosts = {
          ...hosts,
          [hostName]: {
            [sourceType]: hostLocation,
          },
        };
      }
    });
  }

  if (!is<HostList>(hosts)) {
    throw TypeError(
      'The environment variable DEVFILE_REGISTRY_HOSTS can only accept "url" or "local"',
    );
  }

  return hosts;
};

/**
 * Gets the hosts from the config file and the environment variable DEVFILE_REGISTRY_HOSTS
 *
 * @returns a array (tuple) with the HostList as the first element and the potential errors as the second element
 */
export const getHosts = async (): Promise<GetHosts> => {
  const [configHosts, configError] = await asyncTryCatch(
    async () => await getConfigFileHosts('/config/devfile-registry-hosts.json'),
  );
  const [envHosts, envError] = await asyncTryCatch(async () => await getENVHosts());

  let hosts = { ...configHosts, ...envHosts };

  if (!process.env.DEVFILE_COMMUNITY_HOST) {
    hosts = {
      ...hosts,
      Community,
    };
  }

  const errors = [configError, envError];

  return [hosts, errors];
};
