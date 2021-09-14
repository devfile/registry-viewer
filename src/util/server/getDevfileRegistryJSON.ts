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
  // const [hosts, hostErrors] = await getHosts();

  // const [devfiles, devfileError] = await asyncTryCatch(async () => {
  //   let devfiles: Devfile[] = [];
  //   await Promise.all(
  //     Object.entries(hosts).map(async ([hostName, hostLocation]) => {
  //       let extractedDevfiles: Devfile[] = [];
  //       if (is<HostURL>(hostLocation)) {
  //         extractedDevfiles = await getRemoteJSON(hostName, hostLocation.url);
  //       }
  //       if (is<HostLocal>(hostLocation)) {
  //         extractedDevfiles = await getLocalJSON(hostName, hostLocation.local);
  //       }

  //       if (is<Devfile[]>(extractedDevfiles)) {
  //         devfiles = devfiles.concat(extractedDevfiles);
  //       } else {
  //         throw TypeError(
  //           `${hostName} cannot be assigned to type Devfile[]. (A devfile is most likely missing a required parameter)`
  //         );
  //       }
  //     })
  //   );

  //   return devfiles;
  // });

  // const errors = [...hostErrors, devfileError];

  // const errorMessages = errors.map((error) => error?.message || '');
  let devfiles: Devfile[] = [];
  let devfile1: Devfile = {
    name: 'go Test',
    version: '1.0.0',
    displayName: 'Go Runtime',
    description: 'Stack with the latest Go version',
    type: 'stack',
    tags: ['Go'],
    icon: 'https://raw.githubusercontent.com/devfile-samples/devfile-stack-icons/main/golang.svg',
    projectType: 'go',
    language: 'go',
    links: {
      self: 'devfile-catalog/go:latest'
    },
    resources: ['devfile.yaml'],
    starterProjects: ['go-starter'],
    sourceRepo: 'Community',
    provider: 'Red Hat'
  };
  let devfile2: Devfile = {
    name: 'java-openliberty Test',
    version: '0.6.0',
    displayName: 'Open Liberty Maven',
    description: 'Java application stack using Open Liberty runtime',
    type: 'stack',
    tags: ['Java', 'Maven'],
    icon: 'https://raw.githubusercontent.com/OpenLiberty/logos/7fbb132949b9b2589e18c8d5665c1b107028a21d/logomark/svg/OL_logomark.svg',
    projectType: 'openliberty',
    language: 'java',
    links: {
      self: 'devfile-catalog/java-openliberty:latest'
    },
    resources: ['devfile.yaml'],
    starterProjects: ['user-app'],
    sourceRepo: 'Test Source Repo',
    provider: 'AWS'
  };
  devfiles = devfiles.concat(devfile1);
  devfiles = devfiles.concat(devfile2);

  // const errors = [...hostErrors, devfileError];

  const errorMessages = ['']; //errors.map((error) => error?.message || '');

  return [devfiles || [], errorMessages];
};
