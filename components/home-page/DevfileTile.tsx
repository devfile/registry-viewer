import type { Devfile } from 'custom-types'
import type { ForwardedRef } from 'react'

import mainPageLogo from '../../public/images/mainPageLogo.svg'

import { forwardRef } from 'react'
import { Text, TextContent, TextVariants, Brand, Badge, Card, CardTitle, CardBody, CardFooter, CardHeader, CardHeaderMain } from '@patternfly/react-core'

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  devfile: Devfile
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DevfileTile = ({ devfile, onClick }: Props, ref: ForwardedRef<HTMLElement>): React.ReactElement => {
  const numTags = 3

  const onTileClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    console.log(`Devfile Tile: ${devfile.displayName}-clicked`)
    onClick!(event)
  }

  return (
    <Card className="h-auto m-2" onClick={onTileClick} isHoverable data-test-id={`card-${devfile.name.replace(/\.| /g, '')}`}>
      <CardHeader>
        <CardHeaderMain>
          <TextContent>
            <Text className="pb-4" component={TextVariants.p}>{devfile.type[0].toUpperCase() + devfile.type.slice(1)}</Text>
          </TextContent>
          <Brand src={mainPageLogo} alt="" className="h-10" />
        </CardHeaderMain>
      </CardHeader>
      <CardTitle>
        <TextContent>
          <Text component={TextVariants.h3}>{devfile.displayName}</Text>
        </TextContent>
      </CardTitle>
      <CardBody className="h-20 overflow-hidden">
        <TextContent>
          <Text component={TextVariants.p}>{devfile.description}</Text>
        </TextContent>
      </CardBody>
      <CardFooter>
        {devfile.tags?.slice(0, numTags).map((tag) => {
          return <Badge className="m-0.5" key={tag}>{tag}</Badge>
        })}
        { numTags < devfile.tags?.length && <Badge className="m-0.5" isRead>{devfile.tags?.length - numTags} more</Badge> }
      </CardFooter>
    </Card>
  )
}

export default forwardRef(DevfileTile)
