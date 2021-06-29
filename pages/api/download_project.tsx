import next, { NextApiRequest, NextApiResponse } from 'next'
import JSZip from 'jszip'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
        try {

            const data = req.body
            const response = await fetch(data["url"])       
            const array = await response.arrayBuffer()

            let zip = await JSZip.loadAsync(array, {})
            const rootname = Object.keys(zip.files)[0]
            let subdir = zip.folder(rootname)?.folder(data["subdirectory"])

            if (subdir === null || subdir===undefined){
                throw TypeError("subdirectory does not exist")
            }
            let base64send = await subdir.generateAsync({type:"base64"})

            res.status(200)
            res.send(base64send)
            res.end()
          }
        
          
          catch (error) {
            res.json(error);
            res.status(405).end();
          }
        }
        
    