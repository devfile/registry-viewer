import type { Devfile } from 'custom-types'
import type { ForwardedRef } from 'react'

import devfileLogo from '../../public/images/mainPageLogo.svg'
import { capitalizeFirstLetter } from '@util/index'

import { forwardRef } from 'react'
import { Text, TextContent, TextVariants, Brand, Label, LabelGroup, Card, CardTitle, CardBody, CardFooter, CardHeader, CardHeaderMain } from '@patternfly/react-core'

export interface DevfileTileProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  devfile: Devfile
}

/**
 * Renders a {@link DevfileTile} React component.
 * Adds a devfile tile inside of a DevfileGrid
 * @returns `<DevfileTile devfile={devfile}/>`
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DevfileTile: React.ForwardRefRenderFunction<HTMLElement, DevfileTileProps> = ({ devfile, onClick }: DevfileTileProps, ref: ForwardedRef<HTMLElement>) => {
  const maxTags = 3

  const onTileClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    console.log(`Devfile Tile: ${devfile.displayName}-clicked`)
    onClick!(event)
  }

  return (
    <Card style={{ height: 'auto', margin: '0.5rem' }} onClick={onTileClick} isHoverable data-test-id={`card-${devfile.name.replace(/\.| /g, '')}`}>
      <CardHeader>
        <CardHeaderMain>
          <TextContent>
            <Text style={{ paddingBottom: '1rem' }} component={TextVariants.p}>{capitalizeFirstLetter(devfile.type)}</Text>
          </TextContent>
          <Brand
            src={devfile.icon || devfileLogo}
            alt=""
            style={{ height: '2.5rem' }}
          />
        </CardHeaderMain>
      </CardHeader>
      <CardTitle>
        <TextContent>
          <Text component={TextVariants.h3}>{devfile.displayName}</Text>
        </TextContent>
      </CardTitle>
      <CardBody style={{ height: '5rem', overflow: 'hidden' }} >
        <TextContent>
          <Text component={TextVariants.p}>{devfile.description}</Text>
        </TextContent>
      </CardBody>
      <CardFooter>
        <LabelGroup>
          {devfile.tags?.slice(0, maxTags).map((tag) => {
            return <Label style={{ margin: '0.125rem' }} key={tag} color="blue">{tag}</Label>
          })}
        </LabelGroup>
      </CardFooter>
    </Card>
  )
}

/**
 * Renders a {@link ForwardRefedDevfileTile} React wrapper component for DevfileTile.
 * Makes the devfile tile clickable
 * @returns `<Link href={href} passHref><DevfileTile devfile={devfile}/></Link>`
 */
const ForwardRefedDevfileTile = forwardRef(DevfileTile)

export default ForwardRefedDevfileTile
