declare module 'custom-types' {
  export interface Remote {
    [key: string]: string;
  }

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
      remotes: Remote;
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

  type Host = HostStack | HostURL | HostBase;

  export interface HostList {
    [key: string]: Host;
  }
}
