declare module 'custom-types' {
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
      remotes: Record<string, string>;
    };
  }

  export interface FilterElem {
    value: string;
    state: boolean;
    freq: number;
  }
}
