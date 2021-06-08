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

  interface FilterDataElem {
    value: string,
    state: boolean,
    freq: number
  }
}

module.exports = {
  Devfile,
  FilterDataElem,
  TagElem,
  TypeElem,
  StringFreqMap
}
