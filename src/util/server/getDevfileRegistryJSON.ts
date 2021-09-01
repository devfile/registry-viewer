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
  //     return devfiles;
  // });
  let devfiles: Devfile[] = [];
  let devfile1: Devfile = {
    "name": "java-maven",
    "version": "1.1.0",
    "displayName": "Maven Java Test",
    "description": "Upstream Maven and OpenJDK 11",
    "type": "stack",
    "tags": [
      "Java",
      "Maven"
    ],
    "projectType": "maven",
    "language": "java",
    "links": {
      "self": "devfile-catalog/java-maven:latest"
    },
    "resources": [
      "devfile.yaml"
    ],
    "starterProjects": [
      "springbootproject"
    ],
    "sourceRepo": 'Community',
    "provider": "Red Hat",
    "supportURL": "https://github.com/devfile/registry#reporting-any-issue"
  }
  let devfile2: Devfile = {
    "name": "python",
    "version": "1.0.0",
    "displayName": "Python Test",
    "description": "Python Stack with Python 3.7",
    "type": "stack",
    "tags": [
      "Python",
      "pip"
    ],
    "icon": "https://www.python.org/static/community_logos/python-logo-generic.svg",
    "projectType": "python",
    "language": "python",
    "links": {
      "self": "devfile-catalog/python:latest"
    },
    "resources": [
      "devfile.yaml"
    ],
    "starterProjects": [
      "python-example"
    ],
    "sourceRepo": 'Community'
  }
  devfiles = devfiles.concat(devfile1)
  devfiles = devfiles.concat(devfile2)


  // const errors = [...hostErrors, devfileError];

  const errorMessages = [""] //errors.map((error) => error?.message || '');

  return [devfiles || [], errorMessages];
};
