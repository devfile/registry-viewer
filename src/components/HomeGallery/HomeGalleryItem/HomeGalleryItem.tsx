import styles from './HomeGalleryItem.module.css';
import type { Devfile, FilterElem } from 'custom-types';
import type { ForwardedRef } from 'react';
import devfileLogo from '@public/images/devfileLogo.svg';
import { capitalizeFirstLetter } from '@src/util/client';
import {
  Text,
  TextContent,
  TextVariants,
  Brand,
  Label,
  LabelGroup,
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  CardHeader
} from '@patternfly/react-core';

export interface HomeGalleryProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  devfile: Devfile;
  sourceRepos: FilterElem[];
}

/**
 * Renders a {@link HomeGalleryItem} React component.
 * Adds a devfile tile inside of a DevfileGrid
 * @returns `<DevfileTile devfile={devfile}/>`
 */
export const HomeGalleryItem: React.ForwardRefRenderFunction<HTMLElement, HomeGalleryProps> = (
  { devfile, sourceRepos, onClick }: HomeGalleryProps,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ref: ForwardedRef<HTMLElement>
) => {
  const maxTags = 3;

  const onTileClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    onClick!(event);
  };

  return (
    <Card
      className={styles.card}
      onClick={onTileClick}
      isHoverable
      data-testid={`card-${devfile.name.replace(/\.| /g, '')}`}
    >
      <CardHeader className={styles.cardHeader}>
        <div className={styles.cardHeaderDisplay}>
          <Brand
            src={devfile.icon || devfileLogo}
            alt={`${devfile.name} icon`}
            className={styles.cardImage}
          />
          {sourceRepos.length === 1 ? (
            <TextContent>
              <Text className={styles.text}>{capitalizeFirstLetter(devfile.type)}</Text>
            </TextContent>
          ) : (
            <TextContent>
              <Text className={styles.text}>{capitalizeFirstLetter(devfile.sourceRepo)}</Text>
              <Text className={styles.text}>{capitalizeFirstLetter(devfile.type)}</Text>
            </TextContent>
          )}
        </div>
      </CardHeader>
      <CardTitle>
        <TextContent>
          <Text component={TextVariants.h3}>{devfile.displayName}</Text>
        </TextContent>
      </CardTitle>
      <CardBody className={styles.cardBody}>
        <TextContent>
          <Text component={TextVariants.p}>{devfile.description}</Text>
        </TextContent>
      </CardBody>
      <CardFooter>
        <LabelGroup>
          {devfile.tags?.slice(0, maxTags).map((tag) => (
            <Label className={styles.cardFooterTag} key={tag} color="blue">
              {tag}
            </Label>
          ))}
        </LabelGroup>
      </CardFooter>
    </Card>
  );
};
HomeGalleryItem.displayName = 'HomeGalleryItem';
