import type { Devfile, HostList, HostStack, HostURL } from 'custom-types';
import { promises as fs } from 'fs';
import path from 'path';
// @ts-expect-error js-yaml has no type definitions
import { load as yamlToJSON } from 'js-yaml';
import { is } from 'typescript-is';

const defaultHost = {
  Community: {
    url: 'https://registry.stage.devfile.io/'
  }
};

interface getDevfileYAMLReturnType {
  devfileYAML: string | null;
  devfileJSON: Object | string | number | null | undefined;
}

const getConfigFileHosts = async (fileRelPath: string): Promise<HostList> => {
  const splitRelFilePath = fileRelPath.split('/');
  const absFilePath = path.join(process.cwd(), ...splitRelFilePath);
  const hostsUnparsed = await fs.readFile(absFilePath, 'utf8');
  const hosts = JSON.parse(hostsUnparsed) as HostList;

  if (!is<HostList>(hosts)) {
    throw Error('The config file can only accept "url" or "stacks"');
  }

  return hosts;
};

const getRemoteJSON = async (hostName: string, jsonLocation: string): Promise<Devfile[]> => {
  const res = await fetch(`${jsonLocation}/index/all?icon=base64`);
  const devfilesWithoutSource = (await res.json()) as Devfile[];
  const devfilesWithSource = devfilesWithoutSource.map((devfile: Devfile) => {
    devfile.sourceRepo = hostName;
    return devfile;
  });
  return devfilesWithSource;
};

const getLocalJSON = async (hostName: string, jsonLocation: string): Promise<Devfile[]> => {
  const devfileRelPath = jsonLocation.split('/');
  const devfileAbsPath = path.join(process.cwd(), ...devfileRelPath, 'index.json');
  const devfilesUnparsed = await fs.readFile(devfileAbsPath, 'utf8');
  const devfilesWithoutSource = JSON.parse(devfilesUnparsed) as Devfile[];
  const devfilesWithSource = devfilesWithoutSource.map((devfile: Devfile) => {
    devfile.sourceRepo = hostName;
    return devfile;
  });
  return devfilesWithSource;
};

const getRemoteYAML = async (devfileName: string, yamlLocation: string): Promise<string> => {
  const res = await fetch(`${yamlLocation}/devfiles/${devfileName}`, {
    headers: { 'Accept-Type': 'text/plain' }
  });
  const devfileYAML = (await res.text()) as string;
  return devfileYAML;
};

const getLocalYAML = async (devfileName: string, yamlLocation: string): Promise<string> => {
  const devfileYAMLRelPath = `${yamlLocation}/${devfileName}/devfile.yaml`.split('/');
  const devfileYAMLAbsPath = path.join(process.cwd(), ...devfileYAMLRelPath);
  const devfileYAML = (await fs.readFile(devfileYAMLAbsPath, 'utf8')) as string;
  return devfileYAML;
};

const getENVHosts = () => {
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
    throw Error(
      'The environment variable DEVFILE_REGISTRY_HOSTS can only accept "url" or "stacks"'
    );
  }

  return hosts;
};

export const getDevfilesMetadata = async (): Promise<Devfile[]> => {
  let hosts: HostList = await getConfigFileHosts('/config/devfile-registry-hosts.json');
  hosts = { ...hosts, ...getENVHosts() };

  if (!Object.keys(hosts).length) {
    hosts = defaultHost;
  }

  let devfiles: Devfile[] = [];
  await Promise.all(
    Object.entries(hosts).map(async ([hostName, hostLocation]) => {
      let extractedDevfiles: Devfile[] = [];
      if (is<HostURL>(hostLocation)) {
        extractedDevfiles = await getRemoteJSON(hostName, hostLocation.url);
      }
      if (is<HostStack>(hostLocation)) {
        extractedDevfiles = await getLocalJSON(hostName, hostLocation.stacks);
      }

      if (!is<Devfile[]>(extractedDevfiles)) {
        throw Error(
          `${hostName} cannot be assigned to type Devfile[]. (A devfile is most likely missing a required parameter)`
        );
      }

      if (extractedDevfiles.length) {
        devfiles = devfiles.concat(extractedDevfiles);
      }
    })
  );

  return devfiles;
};

export const getDevfileYAML = async (devfile: Devfile): Promise<getDevfileYAMLReturnType> => {
  let devfileYAML = null;
  let devfileJSON = null;

  if (devfile.type !== 'stack') {
    return { devfileYAML, devfileJSON };
  }

  let hosts: HostList = await getConfigFileHosts('/config/devfile-registry-hosts.json');
  hosts = { ...hosts, ...getENVHosts() };

  if (!Object.keys(hosts).length) {
    hosts = defaultHost;
  }

  for (const [hostName, hostLocation] of Object.entries(hosts)) {
    if (hostName === devfile.sourceRepo) {
      if (is<HostURL>(hostLocation)) {
        devfileYAML = await getRemoteYAML(devfile.name, hostLocation.url);
      }
      if (is<HostStack>(hostLocation)) {
        devfileYAML = await getLocalYAML(devfile.name, hostLocation.stacks);
      }
    }
  }

  devfileJSON = yamlToJSON(devfileYAML);

  return { devfileYAML, devfileJSON };
};
