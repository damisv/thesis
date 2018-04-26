import {Component} from '@angular/core';
import {MaterialTheme, ThemeService} from '../services/theme.service';

@Component({
  selector: 'app-pmapp',
  templateUrl: './pmapp.component.html',
  styleUrls: ['./pmapp.component.scss']
})
export class PMAppComponent {
  notifications = 3;
  width: string;
  themes = Object.values(MaterialTheme);

  constructor(private themeService: ThemeService) {}

  changeTheme(theme: MaterialTheme) { this.themeService.changeTheme(theme); }
}
