import { NextApiRequest, NextApiResponse } from 'next';
import absoluteUrl from 'next-absolute-url';
/**
 * request handler for subdirectory download
 * @param req - request body
 * @param res - response body
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Response | void> {
  const { origin } = absoluteUrl(req, 'localhost:3000');

  res.json({ origin });
  res.status(200);
}
