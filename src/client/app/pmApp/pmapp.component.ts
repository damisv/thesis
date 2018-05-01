import {Component} from '@angular/core';
import {MaterialTheme, ThemeService} from '../services/theme.service';
import {UserService} from '../services/user.service';
import {User} from '../models/user';

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
              private userService: UserService) {
    userService.getUser();
    userService.user$.subscribe(user => this.user = user);
  }

  changeTheme(theme: MaterialTheme) { this.themeService.changeTheme(theme); }
}
