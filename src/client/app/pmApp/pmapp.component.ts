import {Component} from '@angular/core';
import {MaterialTheme, ThemeService} from '../services/theme.service';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {ProjectService} from '../services/projects.service';

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
              private projectService: ProjectService) {
    userService.getUser();
    userService.user$.subscribe(user => this.user = user);
    projectService.getProjects();
  }

  changeTheme(theme: MaterialTheme) { this.themeService.changeTheme(theme); }
}
