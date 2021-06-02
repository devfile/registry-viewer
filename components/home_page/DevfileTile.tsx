import type { Devfile } from 'customTypes'

import React from 'react'

import { Badge, Card, CardTitle, CardBody, CardFooter } from '@patternfly/react-core'

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  devfile: Devfile,
};

const DevfileTile = React.forwardRef(({ devfile}: Props, ref) => {
  return (
    <Card isHoverable isRounded>
      <CardTitle>{devfile.displayName}</CardTitle>
      <CardBody>{devfile.description}</CardBody>
      <CardFooter>
        {devfile.tags?.map((tag: string) => {
          return <Badge key={tag}>{tag}</Badge>
        })}
      </CardFooter>
    </Card>
  )
})

export default DevfileTile
