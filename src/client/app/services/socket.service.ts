import {Injectable, OnDestroy} from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService implements OnDestroy {
  // Static Properties
  private static socketServer = 'localhost:8080';
  private static base = '8080';
  private socket;
  // Initialization
  constructor() {
    this.socket = io(SocketService.socketServer);
    this.socket.on('connected', this.register() );
    this.socket.on('loginSuccessful', console.log('socket success login'));
  }

  ngOnDestroy() {
    if ( this.socket !== null ) {
      this.socket.close();
    }
  }

  register() {
    this.socket.emit('register', localStorage.getItem('token'));
  }
}
