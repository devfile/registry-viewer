import type { Devfile } from 'customTypes'

import DevfileTile from '@components/home_page/DevfileTile'

import Link from 'next/link'
import { Gallery } from '@patternfly/react-core'

interface Props {
  searchDevfiles: Devfile[]
}

const DevfileGrid = ({ searchDevfiles }: Props): React.ReactElement => {
  return (
    <Gallery hasGutter style={{ paddingTop: '1rem' }}>
      {searchDevfiles.map((devfile: Devfile, index) => {
        return <Link key={index} href={`/devfiles/${devfile.name}`} passHref><DevfileTile key={index} devfile={devfile}/></Link>
      })}
    </Gallery>
  )
}

export default DevfileGrid
