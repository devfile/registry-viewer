declare module 'custom-types' {
  export interface Remote {
    [key: string]: string;
  }

  export interface Devfile {
    name: string;
    version: string;
    displayName: string;
    description?: string;
    type: string;
    tags: string[];
    icon: string;
    projectType: string;
    language: string;
    links: {
      self: string;
    };
    resources: string[];
    starterProjects: string[];
    git?: {
      remotes: Remote
    }
  }

  export interface FilterElem {
    value: string;
    state: boolean;
    freq: number;
  }
}
