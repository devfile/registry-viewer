import type { PublicRuntimeConfig } from 'custom-types';
import { isClient } from '@src/util/client';
import getConfig from 'next/config';
import Analytics from 'analytics-node';

/**
 * Function that creates an instance of the Analytics object given process.env.ANALYTICS_WRITE_KEY
 *
 * @returns Analytics instance
 */
export const getAnalytics = (): Analytics | null => {
  const { publicRuntimeConfig } = getConfig();
  const { analyticsWriteKey } = publicRuntimeConfig as PublicRuntimeConfig;

  if (isClient() && analyticsWriteKey) {
    const analytics = new Analytics(analyticsWriteKey);

    return analytics;
  }

  return null;
};
