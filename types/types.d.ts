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

  interface TypeElem {
    type: string,
    value: boolean
  }

  interface TagElem {
    tag: string,
    value: boolean
  }

  interface StringFreqMap {
    values: string[],
    freq: number[]
  }
}

module.exports = {
  Devfile,
  TagElem,
  TypeElem,
  StringFreqMap
}
