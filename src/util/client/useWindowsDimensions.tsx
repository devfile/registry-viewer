import type { WindowDimensions } from 'custom-types';
import { useState, useEffect } from 'react';

/**
 * React hook for client side window dimensions
 *
 * @returns a WindowDimensions object
 */
export function useWindowDimensions(): WindowDimensions {
  const hasWindow = typeof window !== 'undefined';

  function getWindowDimensions(): WindowDimensions {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    if (hasWindow) {
      const handleResize = (): void => {
        setWindowDimensions(getWindowDimensions());
      };

      window.addEventListener('resize', handleResize);
      return (): void => window.removeEventListener('resize', handleResize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasWindow]);

  return windowDimensions;
}
