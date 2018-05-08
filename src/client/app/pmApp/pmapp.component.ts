import {Component} from '@angular/core';
import {MaterialTheme, ThemeService} from '../services/theme.service';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {ProjectService} from '../services/projects.service';
import {SocketService} from '../services/socket.service';
import {NotificationService} from '../services/notification.service';

@Component({
  selector: 'app-pmapp',
  templateUrl: './pmapp.component.html',
  styleUrls: ['./pmapp.component.scss']
})
export class PMAppComponent {
  notifications = 3;
  width: string;
  themes = Object.values(MaterialTheme);
  user: User;

  constructor(private themeService: ThemeService,
              private userService: UserService,
              private projectService: ProjectService,
              private notificationService: NotificationService,
              private socketService: SocketService) {
    userService.getUser();
    userService.user$.subscribe(user => this.user = user);
    projectService.getProjects();
    notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications.filter(value => value.status === 'true').length;
    });
  }

  changeTheme(theme: MaterialTheme) { this.themeService.changeTheme(theme); }
}
