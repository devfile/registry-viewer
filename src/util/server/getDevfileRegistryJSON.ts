import type { Devfile, HostLocal, HostURL, GetDevfileRegistryJSON } from 'custom-types';
import { getHosts, asyncTryCatch } from '@src/util/server';
import { promises as fs } from 'fs';
import path from 'path';
import { is } from 'typescript-is';

export const getRemoteJSON = async (
  registryName: string,
  url: string,
  alias: string | undefined,
): Promise<Devfile[]> => {
  const res = await fetch(`${url}/index/all?icon=base64`);
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

export const getLocalJSON = async (
  registryName: string,
  localLocation: string,
): Promise<Devfile[]> => {
  const devfileRelPath = localLocation.split('/');
  const devfileAbsPath = path.join(process.cwd(), ...devfileRelPath, 'index.json');
  const devfilesUnparsed = await fs.readFile(devfileAbsPath, 'utf8');
  const devfilesWithoutName = JSON.parse(devfilesUnparsed) as Devfile[];
  const devfiles = devfilesWithoutName.map((devfile: Devfile) => {
    devfile.registry = registryName;
    return devfile;
  });
  return devfiles;
};

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
