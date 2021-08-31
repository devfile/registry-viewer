import styles from './Arrow.module.css';
import type { Transition } from 'custom-types';
import { getFillStyle, getTransitionStyles } from '@src/util/client';

export type ArrowProps = Transition;

export const Arrow: React.FC<ArrowProps> = ({
  fill,
  backgroundColor,
  flipX,
  flipY
}: ArrowProps) => {
  const fillStyle = getFillStyle(fill);

  const arrowStyle = getTransitionStyles(backgroundColor, !!flipX, !!flipY);

  return (
    <div className={styles.arrow} style={arrowStyle}>
      <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path d="M649.97 0L550.03 0 599.91 54.12 649.97 0z" style={fillStyle}></path>
      </svg>
    </div>
  );
};
Arrow.displayName = 'Arrow';
