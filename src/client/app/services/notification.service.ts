import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {Notification, NotificationSettings} from '../models/notification';
import {PushNotificationService, PushNotificationSettings} from 'ng-push-notification';
import {Router} from '@angular/router';

@Injectable()
export class NotificationService implements OnDestroy {
  // Static Properties
  private static base = 'api/notification';
  private static baseSettings = 'api/settings';

  private static types = ['error', 'success', 'info', 'alert', 'warn'];
  private static notificationTypes = ['push', 'toast', 'none'];
  private static settings = {
    'myTask': 'push',
    'memberJoined': 'none',
    'invite': 'toast',
    'message': 'push',
    'error': 'push'
  };
  private closeDelay = 5000;

  private notifications = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notifications.asObservable();
  private notificationSettings = new BehaviorSubject<any>(NotificationService.settings);
  notificationSettings$ = this.notificationSettings.asObservable();

  // Initialization
  constructor(private http: HttpClient,
              private router: Router,
              private pushNotification: PushNotificationService) {
    this.get();
    this.getSettings();
  }

  private get() {
    this.http.get<Notification[]>(`${NotificationService.base}/`).subscribe(res => this.notifications.next(res));
  }
  post(notification: Notification): Observable<any> {
    return this.http.post(NotificationService.base, {notification: notification});
  }
  put(notification: Notification): Observable<any> {
    return this.http.put(`${NotificationService.base}/`  + notification._id , {notification: notification});
  }
  delete(notification: Notification): Observable<any> {
    return this.http.delete(`${NotificationService.base}/`  + notification._id );
  }
  addNotification(notification: Notification) {
    const temp = this.notifications.value;
    temp.push(notification);
    this.notifications.next(temp);
  }
  private getSettings() {
    this.http.get<any>(`${NotificationService.baseSettings}/`).subscribe(res => this.notificationSettings.next(res));
  }
  putSettings(): Observable<any> {
    return this.http.put(NotificationService.baseSettings , {settings: this.notificationSettings});
  }
  ngOnDestroy() {
  }
  showPush(title: string , body: string, data: any, route: any = null) {
    if (route) {
      this.pushNotification.click$.asObservable()
        .subscribe(value => this.router.navigate(route));
    }
    this.pushNotification.requestPermission()
      .then( () =>
        this.pushNotification.show(
          title,
          { body: body , data: data},
          this.closeDelay // close delay.
        )
      ).catch();
  }
}
