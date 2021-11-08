import type { Devfile, HostLocal, HostURL, GetDevfileYAML } from 'custom-types';
import { getHosts } from '@src/util/server';
import { promises as fs } from 'fs';
import path from 'path';
import { is } from 'typescript-is';
// @ts-expect-error js-yaml has no type definitions
import { load as yamlToJSON } from 'js-yaml';

export const getRemoteYAML = async (devfileName: string, yamlLocation: string): Promise<string> => {
  const res = await fetch(`${yamlLocation}/devfiles/${devfileName}`, {
    headers: { 'Accept-Type': 'text/plain' },
  });
  const devfileYAML = (await res.text()) as string;
  return devfileYAML;
};

export const getLocalYAML = async (devfileName: string, yamlLocation: string): Promise<string> => {
  const devfileYAMLRelPath = `${yamlLocation}/${devfileName}/devfile.yaml`.split('/');
  const devfileYAMLAbsPath = path.join(process.cwd(), ...devfileYAMLRelPath);
  const devfileYAML = (await fs.readFile(devfileYAMLAbsPath, 'utf8')) as string;
  return devfileYAML;
};

export const getDevfileYAML = async (devfile: Devfile): Promise<GetDevfileYAML> => {
  let devfileYAML = null;
  let devfileJSON = null;

  const [hosts, hostErrors] = await getHosts();

  for (const [hostName, hostLocation] of Object.entries(hosts)) {
    if (hostName === devfile.registry) {
      if (is<HostURL>(hostLocation)) {
        devfileYAML = await getRemoteYAML(devfile.name, hostLocation.url);
      }
      if (is<HostLocal>(hostLocation)) {
        devfileYAML = await getLocalYAML(devfile.name, hostLocation.local);
      }
    }
  }

  devfileJSON = yamlToJSON(devfileYAML);

  const errorMessages = hostErrors.map((error) => error?.message || '');

  return [devfileYAML, devfileJSON, errorMessages];
};
