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
    provider?: string;
  }

  export interface FilterElem {
    value: string;
    state: boolean;
    freq: number;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface HostBase {}

  export interface HostLocal extends HostBase {
    local: string;
  }

  export interface HostURL extends HostBase {
    url: string;
  }

  export type Host = HostLocal | HostURL | HostBase;

  export interface HostList {
    [sourceRepo: string]: Host;
  }

  export type TryCatch<T> = [T | null, Error | null];

  export type devfileYAML = string | null;

  export type devfileJSON = Record<string, unknown> | string | number | null | undefined;

  export type GetDevfileYAML = [devfileYAML, devfileJSON, string[]];

  export type GetDevfileRegistryJSON = [Devfile[], string[]];

  export type GetHosts = [HostList, (Error | null)[]];

  export interface Project {
    name: string;
    description?: string;
    attributes?: Record<string, string>;
    git?: Git;
    zip?: {
      location: string;
    };
    subDir?: string;
  }

  export interface Git {
    checkoutFrom?: {
      remote?: string;
      revision?: string;
    };
    remotes: {
      [key: string]: string;
    };
  }

  export interface Link {
    name: string;
    link: string;
  }

  export type Color = 'lighter' | 'light' | 'dark' | 'darker';

  export interface ColorMap {
    name: Color;
    value: string;
  }

  export interface Transition {
    fill: Color;
    backgroundColor: Color;
    flipX?: boolean;
    flipY?: boolean;
  }

  export interface LayoutText {
    title: string;
    bannerTitle: string;
    bannerBody: string;
    headerLinks: Link[];
    footerLinks: Link[];
  }
}
