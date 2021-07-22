/* eslint-disable no-console */

import type { Devfile, Remote } from 'custom-types';
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

const getLocalFile = async (fileRelPath: string): Promise<Remote> => {
  const splitRelFilePath = fileRelPath.split('/');
  const absFilePath = path.join(process.cwd(), ...splitRelFilePath);
  const fileUnparsed = await fs.readFile(absFilePath, 'utf8');
  const file = JSON.parse(fileUnparsed) as Remote;
  return file;
};

const getRemoteEndpoint = async (
  endpointName: string,
  endpointLocation: string
): Promise<Devfile[]> => {
  const res = await fetch(endpointLocation);
  const devfilesWithoutSource = (await res.json()) as Devfile[];
  const devfilesWithSource = devfilesWithoutSource.map((devfile: Devfile) => {
    devfile.sourceRepo = endpointName;
    return devfile;
  });
  return devfilesWithSource;
};

const getLocalEndpoint = async (
  endpointName: string,
  endpointLocation: string
): Promise<Devfile[]> => {
  const devfileRelPath = endpointLocation.split('/');
  const devfileAbsPath = path.join(process.cwd(), ...devfileRelPath);
  const devfilesUnparsed = await fs.readFile(devfileAbsPath, 'utf8');
  const devfilesWithoutSource = JSON.parse(devfilesUnparsed) as Devfile[];
  const devfilesWithSource = devfilesWithoutSource.map((devfile: Devfile) => {
    devfile.sourceRepo = endpointName;
    return devfile;
  });
  return devfilesWithSource;
};

const getRemoteYAML = async (value: string, devfileName: string): Promise<string> => {
  const res = await fetch(`${value}${devfileName}`, {
    headers: { 'Accept-Type': 'text/plain' }
  });
  const devfileYAML = (await res.text()) as string;
  return devfileYAML;
};

const getLocalYAML = async (value: string, devfileName: string): Promise<string> => {
  const devfileYAMLRelPath = `${value}/${devfileName}/devfile.yaml`.split('/');
  const devfileYAMLAbsPath = path.join(process.cwd(), ...devfileYAMLRelPath);
  const devfileYAML = (await fs.readFile(devfileYAMLAbsPath, 'utf8')) as string;
  return devfileYAML;
};

const checkENVFile = () => {
  const sourceRepos = process.env.DEVFILE_SOURCE_REPOS?.split(',').filter(
    (sourceRepo) => sourceRepo !== ''
  );
  const devfileEndpoints = process.env.DEVFILE_ENDPOINTS?.split(',').filter(
    (endpoint) => endpoint !== ''
  );
  const devfileDirectories = process.env.DEVFILE_DIRECTORIES?.split(',').filter(
    (directory) => directory !== ''
  );

  if (
    sourceRepos?.length !== devfileEndpoints?.length ||
    sourceRepos?.length !== devfileDirectories?.length
  ) {
    throw Error(
      'The environment variables DEVFILE_SOURCE_REPOS, DEVFILE_ENDPOINTS, and DEVFILE_DIRECTORIES must be the same array length and in order. Note: Multiple sources should be split by ",".'
    );
  }
};

const getENVEndpoints = () => {
  const sourceRepos = process.env.DEVFILE_SOURCE_REPOS?.split(',').filter(
    (sourceRepo) => sourceRepo !== ''
  );
  const devfileEndpoints = process.env.DEVFILE_ENDPOINTS?.split(',').filter(
    (endpoint) => endpoint !== ''
  );

  let endpoints: Remote = {};

  if (sourceRepos?.length) {
    sourceRepos.forEach(
      (sourceRepo, index) => (endpoints = { ...endpoints, [sourceRepo]: devfileEndpoints![index] })
    );
  }

  return endpoints;
};

const getENVDirectories = () => {
  const sourceRepos = process.env.DEVFILE_SOURCE_REPOS?.split(',').filter(
    (sourceRepo) => sourceRepo !== ''
  );
  const devfileDirectories = process.env.DEVFILE_DIRECTORIES?.split(',').filter(
    (endpoint) => endpoint !== ''
  );

  let directories: Remote = {};

  if (sourceRepos?.length) {
    sourceRepos.forEach(
      (sourceRepo, index) =>
        (directories = { ...directories, [sourceRepo]: devfileDirectories![index] })
    );
  }

  return directories;
};

export const getDevfilesJSON = async (): Promise<Devfile[]> => {
  checkENVFile();

  let devfileEndpoints: Remote = await getLocalFile('/config/devfile-endpoints.json');
  devfileEndpoints = { ...devfileEndpoints, ...getENVEndpoints() };

  let devfiles: Devfile[] = [];
  await Promise.all(
    Object.entries(devfileEndpoints).map(async ([endpointName, endpointLocation]) => {
      let extractedDevfiles: Devfile[] = [];
      if (endpointLocation.includes('http://') || endpointLocation.includes('https://')) {
        extractedDevfiles = await getRemoteEndpoint(endpointName, endpointLocation);
      }
      if (endpointLocation.includes('.json')) {
        extractedDevfiles = await getLocalEndpoint(endpointName, endpointLocation);
      }

      if (extractedDevfiles.length) {
        devfiles = devfiles.concat(extractedDevfiles);
      }
    })
  );

  return devfiles;
};

export const getDevfileYAML = async (devfile: Devfile): Promise<getDevfileYAMLReturnType> => {
  checkENVFile();

  let devfileYAML = null;
  let devfileJSON = null;

  if (devfile.type !== 'stack') {
    return { devfileYAML, devfileJSON };
  }

  let devfileDirectories: Remote = await getLocalFile('/config/devfile-directories.json');
  devfileDirectories = { ...devfileDirectories, ...getENVDirectories() };

  for (const [key, value] of Object.entries(devfileDirectories)) {
    if (key === devfile.sourceRepo) {
      if (value.includes('http://') || value.includes('https://')) {
        devfileYAML = await getRemoteYAML(value, devfile.name);
      } else {
        devfileYAML = await getLocalYAML(value, devfile.name);
      }
    }
  }

  devfileJSON = yamlToJSON(devfileYAML);

  return { devfileYAML, devfileJSON };
};
