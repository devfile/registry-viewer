import type { Devfile, HostLocal, HostURL, GetDevfileRegistryJSON } from 'custom-types';
import { getHosts, asyncTryCatch } from '@src/util/server';
import { promises as fs } from 'fs';
import path from 'path';
import { is } from 'typescript-is';

/**
 * Gets the devfile JSON from a devfile registry endpoint
 *
 * @param registryName - the name of the devfile registry endpoint
 * @param url - the url of the devfile registry endpoint
 * @param alias - the alias of the devfile registry endpoint if {@link url} is localhost
 *
 * @returns a devfile array
 */
export const getRemoteJSON = async (
  registryName: string,
  url: string,
  alias: string | undefined,
): Promise<Devfile[]> => {
  const res = await fetch(`${url}/index/all?icon=base64`, {
    headers: { client: 'registry-viewer' },
  });
  const devfilesWithoutName = (await res.json()) as Devfile[];
  const devfiles = devfilesWithoutName.map((devfile: Devfile) => {
    devfile.registry = registryName;
    devfile.registryLink = alias
      ? `${alias}/devfiles/${devfile.name}`
      : `${url}/devfiles/${devfile.name}`;
    return devfile;
  });
  return devfiles;
};

/**
 * Gets the devfile JSON from a local directory
 *
 * @param registryName - the name of the local devfile directory
 * @param directory - the local directory location
 *
 * @returns a devfile array
 */
export const getLocalJSON = async (registryName: string, directory: string): Promise<Devfile[]> => {
  const devfileRelPath = directory.split('/');
  const devfileAbsPath = path.join(process.cwd(), ...devfileRelPath, 'index.json');
  const devfilesUnparsed = await fs.readFile(devfileAbsPath, 'utf8');
  const devfilesWithoutName = JSON.parse(devfilesUnparsed) as Devfile[];
  const devfiles = devfilesWithoutName.map((devfile: Devfile) => {
    devfile.registry = registryName;
    return devfile;
  });
  return devfiles;
};

/**
 * Gets the devfile JSON from remote and local locations
 *
 * @returns a array (tuple) with the devfile array as the first element and the potential errors as the second element
 */
export const getDevfileRegistryJSON = async (): Promise<GetDevfileRegistryJSON> => {
  const [hosts, hostErrors] = await getHosts();

  const [devfiles, devfileError] = await asyncTryCatch(async () => {
    let devfiles: Devfile[] = [];
    await Promise.all(
      Object.entries(hosts).map(async ([registryName, registry]) => {
        let extractedDevfiles: Devfile[] = [];
        if (is<HostURL>(registry)) {
          extractedDevfiles = await getRemoteJSON(registryName, registry.url, registry.alias);
        }
        if (is<HostLocal>(registry)) {
          extractedDevfiles = await getLocalJSON(registryName, registry.local);
        }

        if (is<Devfile[]>(extractedDevfiles)) {
          devfiles = devfiles.concat(extractedDevfiles);
        } else {
          throw TypeError(
            `${registryName} cannot be assigned to type Devfile[]. (A devfile is most likely missing a required parameter)`,
          );
        }
      }),
    );

    return devfiles;
  });

  const errors = [...hostErrors, devfileError];

  const errorMessages = errors.map((error) => error?.message || '');

  return [devfiles || [], errorMessages];
};
