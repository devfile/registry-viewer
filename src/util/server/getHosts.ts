import type { HostList, GetHosts } from 'custom-types';
import { asyncTryCatch } from '@src/util/server';
import { promises as fs } from 'fs';
import path from 'path';
import { is } from 'typescript-is';

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

export const getENVHosts = (): HostList => {
  const envHosts = process.env.DEVFILE_REGISTRY_HOSTS?.split('|').filter((host) => host !== '');

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

  if (!is<HostList>(hosts)) {
    throw TypeError(
      'The environment variable DEVFILE_REGISTRY_HOSTS can only accept "url" or "local"'
    );
  }

  return hosts;
};

export const getHosts = async (): Promise<GetHosts> => {
  const [configHosts, configError] = await asyncTryCatch(
    async () => await getConfigFileHosts('/config/devfile-registry-hosts.json')
  );
  const [envHosts, envError] = await asyncTryCatch(async () => await getENVHosts());

  let hosts = { ...configHosts, ...envHosts };

  if (!process.env.DEVFILE_COMMUNITY_HOST) {
    hosts = {
      ...hosts,
      Community: {
        url: 'https://registry.stage.devfile.io'
      }
    };
  }

  const errors = [configError, envError];

  return [hosts, errors];
};
