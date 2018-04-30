import {Component} from '@angular/core';
import {MaterialTheme, ThemeService} from '../services/theme.service';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-pmapp',
  templateUrl: './pmapp.component.html',
  styleUrls: ['./pmapp.component.scss']
})
export class PMAppComponent {
  notifications = 3;
  width: string;
  themes = Object.values(MaterialTheme);

  constructor(private themeService: ThemeService,
              private userService: UserService) {
    userService.getUser();
  }

  changeTheme(theme: MaterialTheme) { this.themeService.changeTheme(theme); }
}
