import styles from './Triangle.module.css';
import type { Transition } from 'custom-types';
import { getFillStyle, getTransitionStyles } from '@src/util/client';

export type TriangleProps = Transition;

export const Triangle: React.FC<TriangleProps> = ({
  fill,
  backgroundColor,
  flipX,
  flipY
}: TriangleProps) => {
  const fillStyle = getFillStyle(fill);

  const triangleStyle = getTransitionStyles(backgroundColor, !!flipX, !!flipY);

  return (
    <div className={styles.triangle} style={triangleStyle}>
      <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path d="M1200 0L0 0 598.97 114.72 1200 0z" style={fillStyle}></path>
      </svg>
    </div>
  );
};
Triangle.displayName = 'Triangle';
