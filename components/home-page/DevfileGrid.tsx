import type { Devfile } from 'custom-types'

import DevfileTile from '@components/home-page/DevfileTile'

import Link from 'next/link'
import { Gallery } from '@patternfly/react-core'

interface Props {
  searchDevfiles: Devfile[]
}

const DevfileGrid = ({ searchDevfiles }: Props): React.ReactElement => {
  return (
    <Gallery className="pt-4">
      {searchDevfiles.map((devfile) => {
        return <Link key={devfile.name} href={`/devfiles/${devfile.name}`} passHref><DevfileTile devfile={devfile}/></Link>
      })}
    </Gallery>
  )
}

export default DevfileGrid
