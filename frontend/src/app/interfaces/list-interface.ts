import { Stats } from "fs";
import { ParsedPath } from "path";

export interface ElementInterface {

    data:            Stats;
    pathData:        ParsedPath;
    type:            'file' | 'dir' | 'char' | 'fifo' | 'blk' | 'socket' | 'link' | 'unknown';
    status?:     {
        downloading: boolean;
        progress:    number;
        total:       number;
    }

}

export interface ListInterface {

    path:       string;
    elements:   ElementInterface[];

}
