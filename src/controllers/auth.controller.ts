import { Request, Response } from "express";

import users from '../database/users.database.json';
import { User } from "../models/user.model";

export abstract class AuthController {

    /**
     * Inicia sesión en la store de sesiones del servidor.
     */
    public static login(req: Request, res: Response) {
        if (req.session.user) {
            return res.status(304).json({ payload: 'Session already started' });

        } else {
            const { name, pass } = req.body;
            if (!name || !pass) return res.status(400).json({ payload: 'User or pass empty' });

            users.forEach(dbUser => {
                //@ts-ignore -> En este momento VSCode muestra error, dice que no existe la propiedad lastPath.
                const { name: dbName, password, lastPath } = dbUser;
                if (dbName === name && pass === password) {
                    console.log(dbUser);
                    req.session.user = new User(dbName, pass, lastPath);
                    return res.status(200).json({ name: dbName, lastPath })
                }
            });

            if (!res.headersSent) {
                return res.status(404).json({ payload: 'User not found'});
            }
        }
    }

    public static logout(req: Request, res: Response) {
        if (!req.session.user) return res.sendStatus(200);
        req.session.destroy((err) => {
            if (err) return res.status(500).json({ payload: 'Server logout error', error: err });
            return res.sendStatus(200);
        })
    }

    public static recoverSession(req: Request, res: Response) {

        const { pass, ...rest } = req.session.user!;
        res.json({ ...rest });

    }

    /**
     * Controlador para comprobar si el usuario tiene sesión iniciada en el servidor.
     * Comprueba el método y devuelve una respuesta adecuada.
     */
    public static isLogged(req: Request, res: Response) {
        if (req.method === 'HEAD') {
            if (req.session.user) {
                if (!AuthController.sessionChecker(req.session.user)) {
                    return res.sendStatus(404)

                } else return res.sendStatus(200);

            } else return res.sendStatus(404);
            
        } else if (req.method === 'POST') {
            if (req.session.user) {
                if (!AuthController.sessionChecker(req.session.user)) return res.status(404).json({ payload: 'Not logged in'});
                else {
                    const { name } = req.session.user!;
                    return res.status(200).json({ name: name });
                }
            } else return res.status(404).json({ payload: 'Not logged in' })
        }

    }

    /**
     * Comprueba que todos los campos contengan información.
     * @param user El objeto de usuario de la sesión.
     * @returns boolean
     */
    public static sessionChecker(user: User) {
        if (!user) return false;
        const { name, pass } = user;
        if (!name || !pass) return false
        return true;
    }
}