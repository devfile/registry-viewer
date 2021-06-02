import type { Devfile } from 'customTypes'

import DevfileTile from '@components/home_page/DevfileTile'

import Link from 'next/link'
import { Gallery } from '@patternfly/react-core'

interface Props {
  searchDevfiles: Devfile[]
}

const DevfileGrid = ({ searchDevfiles }: Props) => {
  return (
    <Gallery hasGutter style={{ paddingTop: '1rem' }}>
      {searchDevfiles.map((devfile: Devfile) => {
        return <Link key={devfile.name} href={`/devfiles/${devfile.name}`} passHref><DevfileTile key={devfile.name} devfile={devfile}/></Link>
      })}
    </Gallery>
  )
}

export default DevfileGrid
