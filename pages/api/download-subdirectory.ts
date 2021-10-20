import { NextApiRequest, NextApiResponse } from 'next';
import JSZip from 'jszip';
/**
 * request handler for subdirectory download
 * @param req - request body
 * @param res - response body
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Response | void> {
  try {
    const data = req.body;
    const response = await fetch(data.url);
    const array = await response.arrayBuffer();

    const zip = await JSZip.loadAsync(array, {});

    const notFound = Object.keys(zip.files).every((fileName) => {
      const firstLevelDirectory = fileName.split('/')[1];
      return firstLevelDirectory !== data.subdirectory;
    });
    if (notFound) {
      throw TypeError('subdirectory does not exist');
    }

    const rootName = Object.keys(zip.files)[0];
    const subdirectoryZip = zip.folder(rootName)?.folder(data.subdirectory);

    if (!subdirectoryZip) {
      throw Error('subdirectory zip is null');
    }
    const base64Send = await subdirectoryZip.generateAsync({ type: 'base64' });

    res.status(200);
    res.send(base64Send);
    res.end();
  } catch (e) {
    const error = e as Error;
    if (error.toString().includes('subdirectory does not exist')) {
      res.status(404);
    } else {
      res.status(500);
    }
    res.json({ error: error.toString() });
    res.end();
  }
}
