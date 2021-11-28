import { Request, Response } from 'express';
import { Stats } from 'fs';
import { readdir, stat } from 'fs/promises';
import { extname, parse, ParsedPath } from 'path';

interface ElementInterface {

    data: Stats;
    pathData: ParsedPath;
    type: 'file' | 'dir' | 'char' | 'fifo' | 'blk' | 'socket' | 'link' | 'unknown'

}

export const statWithData = (path: string):Promise<ElementInterface> => {

    return new Promise((resolve, reject) => {
        stat(path)
        .then(a => {
            let type: ElementInterface['type'];
            if      (a.isDirectory())       type = 'dir'
            else if (a.isFile())            type = 'file'
            else if (a.isSymbolicLink())    type = 'link'
            else if (a.isSocket())          type = 'socket'
            else if (a.isCharacterDevice()) type = 'char'
            else if (a.isFIFO())            type = 'fifo'
            else if (a.isBlockDevice())     type = 'char'
            else                            type = 'unknown'
            resolve({ data: a, pathData: parse(path), type })
        })
        .catch(err => reject(err));
    })

}

export abstract class ListController {

    public static listDirectory(req: Request, res: Response) {

        const { path } = req.body;
        const { user } = req.session;

        readdir(path)
        .then(a => {

            Promise.allSettled(a.map( el => {
                return statWithData(path + '/' + el);
            }))
            .then(a => {
                // Declara array de elementos.
                const elements: any = [];

                a.forEach(e => {
                    if (e.status === 'fulfilled') {
                        if (e.value.data.isDirectory()) elements.push(e.value)
                        else if (e.value.data.isFile()) elements.push(e.value);
                    }
                })
                console.log(req.session)
                if (user!.lastPath !== path) {
                    user!.lastPath = path;
                    /* if (req.session.socket) {
                        const { watcher } = req.session.socket;
                        watcher.removeAllListeners();
                        watcher.add(path);
                    } */
                    req.session.save(err => {
                        if (err) console.error(err);
                    })
                }
                
                res.status(200).json({
                    path,
                    elements
                });
            })
        })
        .catch(err => {
            res.status(404).json(err);
        })

    }
}