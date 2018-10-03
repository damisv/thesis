import {Injectable, OnDestroy} from '@angular/core';
import * as io from 'socket.io-client';
import {NotificationService} from './notification.service';
import {Observable} from 'rxjs/Observable';
import {Message, Task} from '../models';

@Injectable()
export class SocketService implements OnDestroy {

  private socket;
  private email;

  constructor(private notificationService: NotificationService) {
    this.socket = io();
    // Login listeners
    this.socket.on('connected', () => this.register());
    this.socket.on('loginSuccessful', (email) => {
      this.email = email;
      notificationService.showPush('success', `${email} logged in`, {});
    });
    //
    this.initListeners();
  }

  // EMITTERS
  private register() {
    this.socket.emit('register', localStorage.getItem('token'));
  }

  // SIMPLE LISTENERS
  private initListeners() {
    this.socket.on('memberJoined', (projectName, email) => {
      this.notificationService.showPush('Team gets bigger!!!', `${email} joined ${projectName}`, {}, ['app', 'invites']);
    });
    this.socket.on('taskAssigned', (projectName, task ) => {
      this.notificationService.showPush('You have a new task',
        `${task.name} from ${projectName} has been assigned to you` ,
        {}, ['app', 'assignmentview', task._id]);
    });
    // this.socket.on('testt', () => this.notificationService.showPush('Test', 'Test', {}));
  }

  // RX LISTENERS
  onProjectMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('projectMessage', (message) => {
        observer.next(message);
        if (this.email !== message.sender) {
          this.notificationService.showPush('New Message Received', `From ${message.sender}`, {}, ['app', 'chat']);
        }
      });
    });
  }
  onInvitation(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('invitation', (notification) => {
        this.notificationService.showPush('Invite', `You've been invited to ${notification.project_name}`, {}, ['app', 'invites']);
        this.notificationService.addNotification(notification);
        observer.next(notification);
      });
    });
  }
  onNewTask(): Observable<{task: Task, email: string}> {
    return new Observable<{task: Task, email: string}>(observer => {
      this.socket.on('taskArrived', (task) => observer.next({task: task, email: this.email}));
    });
  }
  onTaskEdited(): Observable<Task> {
    return new Observable<Task>(observer => {
      this.socket.on('taskEdited', (task) => observer.next(task));
    });
  }

  ngOnDestroy() { if (this.socket) { this.socket.close(); } }
}
