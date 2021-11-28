import { createReadStream, createWriteStream } from 'fs';


import { Request, Response } from 'express'

import formidable from 'formidable'
import { stat } from 'fs/promises';

//formidable.defaultOptions

export abstract class FilesController {

    public static upload(req: Request, res: Response) {
    
        console.log('Subida comenzada');
        
        const form = formidable({
            uploadDir: `${process.cwd()}/uploads/`,
            filename: (name: string, ext: string, part: string, form: string) => { return name + ext },
            keepExtensions: true,
            maxFileSize: 1024**102
        });

        let current = 0;

        form.on('progress', (data, expected) => {
            const total = data/expected*100;
            const currentNew = parseInt(total.toString());
            if (current !== currentNew) {
                current = currentNew
                console.log(current);
            }
        })

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error(err)
              return;
            }
            console.log(files);
            res.json({msg: 'done'})
          });
    }

    /**
     * Controlador de descargas.
     * Lee el cuerpo de la petición y busca la clave path.
     * Intenta obtener información del elemento y prepara una
     * respuesta.
     */
    public static download(req: Request, res: Response) {
        //const { path } = req.body;

        stat('/Users/marcos/Development/fileUpload/uploads/ubuntu-20.04.3-live-server-amd64.iso')
        .then(a => {
            if (a.isFile()) {
                res.writeHead(200, {
                    'content-type': 'stream',
                    'content-disposition': 'attachment; filename=Ubuntu',
                    'content-length': a.size,
                    
                });
        
                createReadStream('/Users/marcos/Development/fileUpload/uploads/ubuntu-20.04.3-live-server-amd64.iso').pipe(res);
            } else {
                res.status(403).json({ msg: 'El elemento es un directorio.'})
            }
        })
        // No types for fs stat error rejection??
        .catch((err) => {
            // TODO: Handle this...
            res.status(500).json(err);
        })
    }

    public static multiUpload(req: Express.Request, res: Express.Response) {

    }
}