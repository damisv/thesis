import {Injectable, OnDestroy} from '@angular/core';
import * as io from 'socket.io-client';
import {NotificationService} from './notification.service';

@Injectable()
export class SocketService implements OnDestroy {
  // Static Properties
  private static socketServer = 'localhost:8080';
  private static base = '8080';
  private socket;
  // Initialization
  constructor( private notificationService: NotificationService) {
    this.socket = io(SocketService.socketServer , {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax : 60000,
      reconnectionAttempts: 5
    });
    this.socket.on('connected', this.register() );
    this.socket.on('loginSuccessful', function() {console.log('success login');
    notificationService.showPush('success', 'login YUPIE' , {}); } );
    this.socket.on('projectCreated',  function(date) {console.log('project created'); });
    this.socket.on('loginError', function(date) {console.log('login error'); });
    this.socket.on('Invitation', (projectName , notification) => console.log('invitation for ' + projectName));
    this.socket.on('memberJoined', (projectName , email) => console.log('member joined ' + projectName + email));
    this.socket.on('reconnecting', function(date) {console.log('reconnecting'); });
    this.socket.on('taskAssigned', (projectName , task ) => console.log('task assigned for ' + projectName));
    this.socket.on('projectMessage', id => console.log('project message'));
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
