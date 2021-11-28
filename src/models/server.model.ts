import { Server as HttpServer } from 'http';
import { randomBytes } from 'crypto';

import express from 'express';
import { ParamsDictionary } from 'express-serve-static-core'
import QueryString from 'qs';
import SocketIO from 'socket.io';
import cors from 'cors';
import session, { MemoryStore } from 'express-session';

import sharedSession from 'express-socket.io-session'

import { Routes } from '../router/main.routes';
import { webSocket } from '../events/sockets.events';

export class Server {

    private api = express.application;
    private server:  HttpServer;
    private socket:  SocketIO.Server;
    private sessionStore: express.RequestHandler<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>

    constructor(port = 3000) {
        this.sessionStore = session({
            store: new MemoryStore(),
            secret: randomBytes(10).toString('hex'),
            cookie: { secure: false, httpOnly: true },
            saveUninitialized: false,
            resave: true
        })
        this.load(port);
    }

    private Router() {
        this.api.use('/api', new Routes().routes);
    }

    private Midddlewares() {
        try {
            this.api
            .use(cors({ origin: ['*'], credentials: true }))
            .use(express.json())
            .use(this.sessionStore);
            this.socket.use(sharedSession(this.sessionStore, {
                autoSave: true,
                saveUninitialized: false
            }));
        } catch (error) {
            console.log('%c ✕ Excepción al cargar algún middleware. ', 'background: orange; color: black')
            //TODO: Volcar las trazas de la pila en un archivo de logs (Winston?).
            console.trace();
        }
    }
    
    private load(port: number) {
        this.loadServers();
        this.Midddlewares();
        this.Router();
        this.run(port);
    }
    
    private loadServers() {
        this.api = express();
            console.log('%c ✓ Servidor API cargado ', 'background: green');
        this.server = new HttpServer(this.api);
            console.log('%c ✓ Servidor HTTP cargado ', 'background: green');
        this.socket = new SocketIO.Server(this.server, { cors: { origin: '*' } });
            console.log('%c ✓ Servidor HTTP cargado ', 'background: green');
    }

    private run(port: number) {
        this.server.listen(port, () => {
            this.socket.on('connection', (socket) => new webSocket(socket));
            console.log(`%c ✓ Servidor en marcha en el puerto ${port} `, 'background: #0080FF');
        })
    }
}