import type { LayoutText } from 'custom-types';
import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import { is } from 'typescript-is';

/**
 * request handler for getting the layout text
 * @param req - request body
 * @param res - response body
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<Response | void> {
  const filePath = path.join(process.cwd(), 'webpage_info', 'layout-text.json');
  const layoutTextUnparsed = await fs.readFile(filePath, 'utf8');
  const layoutText = JSON.parse(layoutTextUnparsed) as LayoutText;

  if (is<LayoutText>(layoutText)) {
    res.json({ layoutText });
    res.status(200);
    res.end();
    return;
  }

  res.json({ error: 'Invalid layout text' });
  res.status(500);
  res.end();
  return;
}
