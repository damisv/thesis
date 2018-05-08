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
      reconnectionDelay: 500,
      reconnectionDelayMax : 1000,
      reconnectionAttempts: 15
    });
    this.socket.on('connected', this.register() );
    this.socket.on('loginSuccessful', function() {console.log('success login');
      notificationService.showPush('success', 'login YUPIE' , {}); } );
    /*this.socket.on('projectCreated',  function(date) {console.log('project created'); });*/
    this.socket.on('loginError', function(date) {console.log('login error'); });
    this.socket.on('joinProject', function(id)  {this.joinProject(id); }.bind(this));
    this.socket.on('Invitation', function(notification) { console.log('invitation for ' + notification.project_name);
      notificationService.showPush('Invitation', notification.project_name + ' sent you an invitation' , {}); });
    this.socket.on('memberJoined', function(projectName , email) { console.log('member joined ' + projectName + email);
      notificationService.showPush('New Member Joined', email + ' joined ' + projectName , {}); });
    this.socket.on('reconnecting', function(date) {console.log('reconnecting'); });
    this.socket.on('taskAssigned', function(projectName , task ) { console.log('task assigned for ' + projectName);
      notificationService.showPush('New Task', projectName + ' sent you a task' , {}); });
    this.socket.on('projectMessage', function(id) { console.log('project message');
      notificationService.showPush('New Message', 'New Message' , {}); });
  }

  ngOnDestroy() {
    if ( this.socket !== null ) {
      this.socket.close();
    }
  }

  joinProject(id) {
    console.log('emit join id ' + id);
    this.socket.emit('joinProject', id);
  }
  register() {
    this.socket.emit('register', localStorage.getItem('token'));
  }
}
