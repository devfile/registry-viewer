import type { Devfile, HostLocal, HostURL, GetDevfileRegistryJSON } from 'custom-types';
import { getHosts, asyncTryCatch } from '@src/util/server';
import { promises as fs } from 'fs';
import path from 'path';
import { is } from 'typescript-is';

export const getRemoteJSON = async (hostName: string, jsonLocation: string): Promise<Devfile[]> => {
  const res = await fetch(`${jsonLocation}/index/all?icon=base64`);
  const devfilesWithoutSource = (await res.json()) as Devfile[];
  const devfilesWithSource = devfilesWithoutSource.map((devfile: Devfile) => {
    devfile.sourceRepo = hostName;
    return devfile;
  });
  return devfilesWithSource;
};

export const getLocalJSON = async (hostName: string, jsonLocation: string): Promise<Devfile[]> => {
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

export const getDevfileRegistryJSON = async (): Promise<GetDevfileRegistryJSON> => {
  const [hosts, hostErrors] = await getHosts();

  const [devfiles, devfileError] = await asyncTryCatch(async () => {
    let devfiles: Devfile[] = [];
    await Promise.all(
      Object.entries(hosts).map(async ([hostName, hostLocation]) => {
        let extractedDevfiles: Devfile[] = [];
        if (is<HostURL>(hostLocation)) {
          extractedDevfiles = await getRemoteJSON(hostName, hostLocation.url);
        }
        if (is<HostLocal>(hostLocation)) {
          extractedDevfiles = await getLocalJSON(hostName, hostLocation.local);
        }

        if (is<Devfile[]>(extractedDevfiles)) {
          devfiles = devfiles.concat(extractedDevfiles);
        } else {
          throw TypeError(
            `${hostName} cannot be assigned to type Devfile[]. (A devfile is most likely missing a required parameter)`
          );
        }
      })
    );

    return devfiles;
  });

  const errors = [...hostErrors, devfileError];

  const errorMessages = errors.map((error) => error?.message || '');

  return [devfiles || [], errorMessages];
};
