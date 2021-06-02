import type { Devfile } from 'customTypes'
import DevfileTile from '@components/DevfileTile'

import { Gallery } from '@patternfly/react-core'

interface Props {
  searchDevfiles: Devfile[]
}

const DevfileGrid = ({ searchDevfiles }: Props) => {
  return (
    <Gallery hasGutter style={{ paddingTop: '1rem' }}>
      {searchDevfiles.map((devfile: Devfile) => {
        return <DevfileTile key={devfile.name} devfile={devfile}/>
      })}
    </Gallery>
  )
}

export default DevfileGrid
