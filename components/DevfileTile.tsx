import type { Devfile } from 'customTypes'

import Link from 'next/link'

import { Badge, Card, CardTitle, CardBody, CardFooter } from '@patternfly/react-core'

interface Props { key: string, devfile: Devfile };

const DevfileTile = ({ devfile }: Props) => {
  return (
    <Link href={`/devfiles/${devfile.name}`}>
      <Card isHoverable isRounded>
        <CardTitle>{devfile.displayName}</CardTitle>
        <CardBody>{devfile.description}</CardBody>
        <CardFooter>
          {devfile.tags?.map((tag: string) => {
            return <Badge key={tag}>{tag}</Badge>
          })}
        </CardFooter>
      </Card>
    </Link>
  )
}

export default DevfileTile
