import {Component} from '@angular/core';
import {Notification} from '../../../../models/notification';

@Component({
  selector: 'app-pmapp-notifications',
  templateUrl: './notifications.component.html',
  styles: ['']
})
export class NotificationsComponent {
  notifications: Notification[] = [
    new Notification('email@email.com', 'task', [''], new Date(), 'true', ''),
    new Notification('email@email.com', 'issue', [''], new Date(), 'false', ''),
    new Notification('email@email.com', 'task', [''], new Date(), 'true', ''),
    new Notification('email@email.com', 'issue', [''], new Date(), 'true', ''),
    new Notification('email@email.com', 'task', [''], new Date(), 'false', ''),
    new Notification('email@email.com', 'task', [''], new Date(), 'true', ''),
    new Notification('email@email.com', 'project', [''], new Date(), 'false', ''),
    new Notification('email@email.com', 'project', [''], new Date(), 'false', ''),
  ];

  constructor() {}
}
