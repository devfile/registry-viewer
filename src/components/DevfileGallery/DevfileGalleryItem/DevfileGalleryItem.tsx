import styles from './DevfileGalleryItem.module.css';
import type { Devfile } from 'custom-types';
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
  CardHeader,
  CardHeaderMain
} from '@patternfly/react-core';

export interface DevfileGalleryProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  devfile: Devfile;
}

/**
 * Renders a {@link DevfileGalleryItem} React component.
 * Adds a devfile tile inside of a DevfileGrid
 * @returns `<DevfileTile devfile={devfile}/>`
 */
export const DevfileGalleryItem: React.ForwardRefRenderFunction<HTMLElement, DevfileGalleryProps> =
  (
    { devfile, onClick }: DevfileGalleryProps,
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
        data-test-id={`card-${devfile.name.replace(/\.| /g, '')}`}
      >
        <CardHeader>
          <CardHeaderMain>
            <TextContent>
              <Text className={styles.cardHeader} component={TextVariants.p}>{`${
                devfile.sourceRepo
              } - ${capitalizeFirstLetter(devfile.type)}`}</Text>
            </TextContent>
            <Brand
              src={devfile.icon || devfileLogo}
              alt={`${devfile.name} icon`}
              className={styles.cardImage}
            />
          </CardHeaderMain>
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
DevfileGalleryItem.displayName = 'DevfileGalleryItem';
