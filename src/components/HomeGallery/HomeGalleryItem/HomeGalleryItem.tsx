import styles from './HomeGalleryItem.module.css';
import type { Devfile, FilterElem, DefaultProps } from 'custom-types';
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
} from '@patternfly/react-core';

export interface HomeGalleryItemProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    DefaultProps {
  devfile: Devfile;
  registries: FilterElem[];
  providers: FilterElem[];
}

/**
 * Renders a {@link HomeGalleryItem} React component.
 * Adds a devfile tile inside of a DevfileGrid
 * @returns `<DevfileTile devfile={devfile}/>`
 */
export const HomeGalleryItem: React.FC<HomeGalleryItemProps> = ({
  devfile,
  registries,
  providers,
  onClick,
}: HomeGalleryItemProps) => {
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
          <TextContent>
            {registries.length !== 1 && (
              <Text className={styles.text}>{capitalizeFirstLetter(devfile.registry)}</Text>
            )}
            <Text className={styles.text}>{capitalizeFirstLetter(devfile.type)}</Text>
          </TextContent>
        </div>
      </CardHeader>
      <CardTitle>
        <TextContent>
          <Text component={TextVariants.h3}>{devfile.displayName}</Text>
          {providers.length > 1 && devfile.provider !== '' && (
            <Text component={TextVariants.small}>Provided by: {devfile.provider}</Text>
          )}
        </TextContent>
      </CardTitle>
      <CardBody className={styles.cardBody}>
        <TextContent>
          <Text component={TextVariants.p} className={styles.longDescription}>
            {devfile.description}
          </Text>
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
