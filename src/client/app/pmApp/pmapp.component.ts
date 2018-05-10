import {Component} from '@angular/core';
import {MaterialTheme, ThemeService, UserService,
  ProjectService, NotificationService} from '../services';
import {User} from '../models';
import {Router} from '@angular/router';
import {SocketService} from '../services/socket.service';

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
              private router: Router,
              private socketService: SocketService) {
    userService.getUser();
    userService.user$.subscribe(user => this.user = user);
    projectService.getProjects();
    notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications.filter(value => value.status === 'true').length;
    });
  }

  changeTheme(theme: MaterialTheme) { this.themeService.changeTheme(theme); }

  logout() { this.router.navigate(['auth', 'signin']); }
}
