import type { Devfile, Host } from 'custom-types';
import { promises as fs } from 'fs';
import path from 'path';
// @ts-expect-error js-yaml has no type definitions
import { load as yamlToJSON } from 'js-yaml';

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '.env.config' });
}

interface getDevfileYAMLReturnType {
  devfileYAML: string | null;
  devfileJSON: Object | string | number | null | undefined;
}

const getLocalFile = async (fileRelPath: string): Promise<Host> => {
  const splitRelFilePath = fileRelPath.split('/');
  const absFilePath = path.join(process.cwd(), ...splitRelFilePath);
  const fileUnparsed = await fs.readFile(absFilePath, 'utf8');
  const file = JSON.parse(fileUnparsed) as Host;
  return file;
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
  const envHosts = process.env.DEVFILE_REGISTRY_HOSTS?.split(',').filter((host) => host !== '');

  let hosts: Host = {};

  if (envHosts?.length) {
    envHosts.forEach((envHost) => {
      const [hostName, type, hostLocation] = envHost.split('>');
      hosts = {
        ...hosts,
        [hostName]: {
          [type]: hostLocation
        }
      };
    });
  }

  return hosts;
};

export const getDevfileSources = async (): Promise<string[]> => {
  let hosts: Host = await getLocalFile('/config/devfile-registry-hosts.json');
  hosts = { ...hosts, ...getENVHosts() };

  const sources = Object.keys(hosts);

  // eslint-disable-next-line no-console
  console.log(sources);

  return sources;
};

export const getDevfilesJSON = async (): Promise<Devfile[]> => {
  let hosts: Host = await getLocalFile('/config/devfile-registry-hosts.json');
  hosts = { ...hosts, ...getENVHosts() };

  let devfiles: Devfile[] = [];
  await Promise.all(
    Object.entries(hosts).map(async ([hostName, hostLocation]) => {
      let extractedDevfiles: Devfile[] = [];
      if (hostLocation.url) {
        extractedDevfiles = await getRemoteJSON(hostName, hostLocation.url);
      }
      if (hostLocation.stacks) {
        extractedDevfiles = await getLocalJSON(hostName, hostLocation.stacks);
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

  let hosts: Host = await getLocalFile('/config/devfile-registry-hosts.json');
  hosts = { ...hosts, ...getENVHosts() };

  for (const [hostName, hostLocation] of Object.entries(hosts)) {
    if (hostName === devfile.sourceRepo) {
      if (hostLocation.url) {
        devfileYAML = await getRemoteYAML(devfile.name, hostLocation.url);
      }
      if (hostLocation.stacks) {
        devfileYAML = await getLocalYAML(devfile.name, hostLocation.stacks);
      }
    }
  }

  devfileJSON = yamlToJSON(devfileYAML);

  return { devfileYAML, devfileJSON };
};