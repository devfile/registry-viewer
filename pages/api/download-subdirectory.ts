import { NextApiRequest, NextApiResponse } from 'next';
import JSZip from 'jszip';
/**
 * request handler for subdirectory download
 * @param req - request body
 * @param res - response body
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body;
    const response = await fetch(data.url);
    const array = await response.arrayBuffer();

    const zip = await JSZip.loadAsync(array, {});
    const rootName = Object.keys(zip.files)[0];
    const subDirZip = zip.folder(rootName)?.folder(data.subdirectory);

    if (subDirZip === null || subDirZip === undefined) {
      throw TypeError('subdirectory does not exist');
    }
    const base64send = await subDirZip.generateAsync({ type: 'base64' });

    res.status(200);
    res.send(base64send);
    res.end();
  } catch (error) {
    res.json(error);
    res.status(404).end();
  }
}
