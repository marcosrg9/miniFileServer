import express, { Router } from 'express';
import { readdir } from 'fs/promises';
import { AuthController } from '../controllers/auth.controller';
import { ListController } from '../controllers/list.controller';
import { FilesController } from '../controllers/files.controller';

import { checkSession } from '../middlewares/sessionChecker.middleware'

export class Routes {

    routes: Router = Router();

    constructor() {

        this.static();
        this.files()
        this.list();
        this.auth();
        console.log('%c ✓ Router cargado ', 'background: green');
    }
    
    private static() {
        this.routes.use(express.static(process.cwd() + '/src/public'));
    }
    
    private files() {
        // Upload
        this.routes.post('/upload', checkSession, FilesController.upload);
        // Download
        //this.routes.post('/download', checkSession, FilesController.download);
        //this.routes.post('/prepare', checkSession, FilesController.prepare)
        this.routes.get('/download', checkSession, FilesController.download)
    }
    
    private list() {
        this.routes.post('/list', checkSession, ListController.listDirectory);
    }

    private auth() {
        this.routes.post('/auth/login', AuthController.login);
        this.routes.get('/auth/logout', AuthController.logout);
        this.routes.head('/auth/islogged', AuthController.isLogged);
        this.routes.get('/auth/sessionData', checkSession, AuthController.recoverSession)
    } 
}