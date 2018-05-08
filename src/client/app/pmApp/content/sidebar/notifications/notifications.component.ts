import {Component} from '@angular/core';
import {Notification} from '../../../../models/notification';
import {NotificationService} from '../../../../services/notification.service';

@Component({
  selector: 'app-pmapp-notifications',
  templateUrl: './notifications.component.html',
  styles: ['']
})
export class NotificationsComponent {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {
    notificationService.notifications$.subscribe(notifications => this.notifications = notifications);
  }
}
