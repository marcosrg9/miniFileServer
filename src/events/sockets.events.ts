import { Socket } from 'socket.io';
import { watch, FSWatcher } from 'chokidar'
import { AuthController } from '../controllers/auth.controller';

export class webSocket {

    /** El objeto del socket del cliente. */
    socket:  Socket;
    /** El observador del sistema de archivos. */
    watcher: FSWatcher;
    /** El intervalo destructor de la sesión. */
    destroyer: NodeJS.Timer

    constructor(socket: Socket) {
        this.socket = socket;
        if (!socket.handshake.session) this.disconnect()
        else if (!socket.handshake.session.user) this.disconnect()
        else if (!AuthController.sessionChecker(socket.handshake.session.user)) this.disconnect()
        else {
            this.listenEvents();
        }
        if (this.destroyer) clearTimeout(this.destroyer);
    }

    private listenEvents() {
        //this.socket.handshake.session.socket = this;
        this.socket.handshake.session.socket = this.socket;
        /**
         * //TODO: Buscar patrón de repetición del handshake/sesión.
         *    ->?? El depurador no da información sobre qué propiedad se está repitiendo.
         * 💡 Clase abstracta
         *    · Métodos estáticos de control y filtrado de ids de socket.
         * 💡 Acceder al almacén de sesiones de forma directa(?)
         */
        
        //this.socket.handshake.session.socket = this.socket.id;
        const { handshake, nsp, ...rS } = this.socket;
        const { session, ...rH } = handshake;

        const newData = {
            ...rS,
            handshake: rH
        }

        this.socket.handshake.session.socket = newData;

        this.socket.handshake.session.save();

        this.watcher = watch(this.socket.handshake.session.user!.lastPath, { depth: 0, ignoreInitial: true })
            .on('all', (...watch) => {
                this.socket.emit('fsEvent', [...watch]);
                this.socket.send('fsEvent', [...watch]);
                console.log(...watch)
            } );
        
        this.socket.on('disconnect', (reason) => {
            this.destroyer = setTimeout(() => {
                this.destroy();
                // 5 minutos de timeout.
            }, 300000);
        })
    }
    
    public disconnect() {
        this.socket.disconnect();
        this.destroy();
    }
    
    private destroy() {
        this.socket.handshake.session.destroy((err) => {
            if (err) setTimeout(() => this.destroy(), 10000)
        })
    }
}