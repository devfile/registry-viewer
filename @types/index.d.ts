declare module 'custom-types' {
  export interface Devfile {
    name: string;
    version?: string;
    displayName: string;
    description?: string;
    type: string;
    tags?: string[];
    icon?: string;
    projectType: string;
    language: string;
    links?: {
      self: string;
    };
    resources?: string[];
    starterProjects?: string[];
    git?: {
      remotes: {
        [key: string]: string;
      };
    };
    sourceRepo: string;
  }

  export interface FilterElem {
    value: string;
    state: boolean;
    freq: number;
  }

  interface HostBase {}

  export interface HostStack extends HostBase {
    stacks: string;
  }

  export interface HostURL extends HostBase {
    url: string;
  }

  export type Host = HostStack | HostURL | HostBase;

  export interface HostList {
    [sourceRepo: string]: Host;
  }

  export type TryCatch<T> = [T | null, Error | null];

  export type devfileYAML = string | null;
  export type devfileJSON = Object | string | number | null | undefined;
  export type GetDevfileYAML = [devfileYAML, devfileJSON, string[]];

  export type GetMetadataOfDevfiles = [Devfile[], string[]];
}
