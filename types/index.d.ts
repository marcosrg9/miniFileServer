import { Session, SessionData } from 'express-session';
import { Socket } from 'socket.io'
import { User } from '../src/models/user.model';

declare module 'express-session' {
    export interface SessionData {
        /** Información del usuario con sesión iniciada. */
        user: User;
        /** Datos del socket del usuario. */
        socket: any;
    }
}

declare module 'socket.io/dist/socket' {
    export interface Handshake {
        session: Session & Partial<SessionData>;
    }
}