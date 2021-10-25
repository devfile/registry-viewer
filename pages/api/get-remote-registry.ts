import type { HostURL } from 'custom-types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getHosts } from '@src/util/server';
import { is } from 'typescript-is';

export interface ReqBody {
  sourceRepo: string;
}

/**
 * request handler for getting remote registries
 * @param req - request body
 * @param res - response body
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Response | void> {
  const { sourceRepo } = req.body as ReqBody;

  const [hosts, errors] = await getHosts();

  errors.forEach((error) => {
    if (error) {
      res.json(error);
      res.status(500);
      res.end();
      return;
    }
  });

  Object.entries(hosts).forEach(([hostSourceRepo, host]) => {
    if (hostSourceRepo === sourceRepo) {
      if (is<HostURL>(host)) {
        res.json({ origin: host.publicURL || host.url });
        res.status(200);
        res.end();
        return;
      }
    }
  });

  res.status(404);
  res.end();
  return;
}
