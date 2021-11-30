import type { Devfile, HostLocal, HostURL, GetDevfileYAML } from 'custom-types';
import { getHosts } from '@src/util/server';
import { promises as fs } from 'fs';
import path from 'path';
import { is } from 'typescript-is';
// @ts-expect-error js-yaml has no type definitions
import { load as yamlToJSON } from 'js-yaml';

/**
 * Gets the devfile json from a devfile registry endpoint
 *
 * @param devfileName - the devfile name
 * @param url - the url of the devfile registry endpoint
 *
 * @returns the devfile YAML
 */
export const getRemoteYAML = async (devfileName: string, url: string): Promise<string> => {
  const res = await fetch(`${url}/devfiles/${devfileName}`, {
    headers: { 'Accept-Type': 'text/plain', client: 'registry-viewer' },
  });
  const devfileYAML = (await res.text()) as string;
  return devfileYAML;
};

/**
 * Get the devfile YAML from a local directory
 *
 * @param devfileName - the devfile name
 * @param directory - the local directory location
 *
 * @returns the devfile YAML
 */
export const getLocalYAML = async (devfileName: string, directory: string): Promise<string> => {
  const devfileYAMLRelPath = `${directory}/${devfileName}/devfile.yaml`.split('/');
  const devfileYAMLAbsPath = path.join(process.cwd(), ...devfileYAMLRelPath);
  const devfileYAML = (await fs.readFile(devfileYAMLAbsPath, 'utf8')) as string;
  return devfileYAML;
};

/**
 * Gets the devfile YAML from remote and local locations
 *
 * @param devfile - the devfile you want the YAML for
 *
 * @returns a array (tuple) with the devfile YAML as the first element and the potential errors as the second element
 */
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
