import styles from './TriangleAsymmetrical.module.css';
import type { Transition } from 'custom-types';
import { getFillStyle, getTransitionStyles } from '@src/util/client';

export type TriangleAsymmetricalProps = Transition;

export const TriangleAsymmetrical: React.FC<TriangleAsymmetricalProps> = ({
  fill,
  backgroundColor,
  flipX,
  flipY
}: TriangleAsymmetricalProps) => {
  const fillStyle = getFillStyle(fill);

  const triangleAsymmetricalStyle = getTransitionStyles(backgroundColor, !!flipX, !!flipY);

  return (
    <div className={styles.triangleAsymmetrical} style={triangleAsymmetricalStyle}>
      <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path d="M1200 0L0 0 892.25 114.72 1200 0z" style={fillStyle}></path>
      </svg>
    </div>
  );
};
TriangleAsymmetrical.displayName = 'TriangleAsymmetrical';
