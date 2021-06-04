declare module 'customTypes' {
  interface Devfile {
    name: string;
    version: string;
    displayName: string;
    description?: string;
    type: string;
    tags: string[];
    projectType: string;
    language: string;
    links: {
      self: string;
    }
    resources: string[];
    starterProjects: string[];
    git?: {
      remotes: {
        origin: string
      }
    }
  }

  interface TypeElem { type: string, value: boolean };
  interface TagElem { tag: string, value: boolean };
}

module.exports = {
  Devfile,
  TagElem,
  TypeElem
}
