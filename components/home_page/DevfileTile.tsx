import type { Devfile } from 'customTypes'
import type { ForwardedRef } from 'react'

import { useState, forwardRef } from 'react'
import { Badge, Card, CardTitle, CardBody, CardFooter } from '@patternfly/react-core'

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  devfile: Devfile
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DevfileTile = ({ devfile, onClick }: Props, ref: ForwardedRef<HTMLElement>): React.ReactElement => {
  const [numTags, setNumTags] = useState<number>(3)

  const onCardClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const target: EventTarget = event.target
    const classList: DOMTokenList = (target as HTMLInputElement).classList
    const isBadge: boolean = classList.contains('pf-c-badge')
    const isRead: boolean = classList.contains('pf-m-read')
    if (!(isBadge && isRead)) {
      onClick!(event)
    }
  }

  const onMoreClick = () => {
    setNumTags(numTags + 6)
  }

  const onLessClick = () => {
    if (numTags - 6 < 3) {
      setNumTags(3)
    } else {
      setNumTags(numTags - 6)
    }
  }

  return (
    <Card onClick={onCardClick} isHoverable>
      <CardTitle>{devfile.displayName}</CardTitle>
      <CardBody>{devfile.description}</CardBody>
      <CardFooter>
        {devfile.tags?.slice(0, numTags).map((tag: string, index) => {
          return <Badge style={{ margin: '0.1rem' }} key={index}>{tag}</Badge>
        })}
        { numTags < devfile.tags?.length && <Badge style={{ margin: '0.1rem' }} onClick={onMoreClick} isRead>{devfile.tags?.length - numTags} more</Badge> }
        { numTags > 3 && <Badge style={{ margin: '0.1rem' }} onClick={onLessClick} isRead>Less</Badge> }
      </CardFooter>
    </Card>
  )
}

export default forwardRef(DevfileTile)
