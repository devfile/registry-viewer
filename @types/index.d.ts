declare module 'custom-types' {

  export interface Remote {
    [key: string]: string
  }

  export interface Devfile {
    name: string,
    version: string,
    displayName: string,
    description?: string,
    type: string,
    tags: string[],
    projectType: string,
    language: string,
    links: {
      self: string
    },
    resources: string[],
    starterProjects: string[],
    git?: {
      remotes: Remote[]
    }
  }

  export interface FilterDataElem {
    value: string,
    state: boolean,
    freq: number
  }
}

declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.json' {
  const content: string
  export default content
}
