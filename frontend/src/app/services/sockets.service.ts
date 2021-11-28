import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from './auth.service';
import { FilesService } from './files.service';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {

  private websockets: Socket;

  constructor(private files: FilesService,
              private auth: AuthService) {
    const { protocol, host, port:p, origin } = location;
    const port = p || ":80";
    this.websockets = new Socket({ url: `${origin}`, options: {
      autoConnect: false,
      reconnectionAttempts: 5
    }})
    this.websockets.on('connect', () => {
      console.log('%c ✓ Conexión webSocket abierta ', 'background: green')
    });
    this.websockets.on('reconnect', () => {
      console.log('Reconnection!')
    })
    this.websockets.on('fsEvent', (params: []) => {
      console.log('Llamando...');
      files.list(auth.user.lastPath)
    })
    this.websockets.connect();
  }

  public connect() {
    this.websockets.connect();
  }

  public disconnect() {
    this.websockets.disconnect();
  }
}
