import type { WindowDimensions } from 'custom-types';
import { useState, useEffect } from 'react';

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
  }, [hasWindow]);

  return windowDimensions;
}
