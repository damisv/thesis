import {Component, HostListener} from '@angular/core';
import {MaterialTheme, ThemeService} from '../services/theme.service';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent {
  // Properties
  isDark = false;
  isTop = false;

  // Initializations
  constructor(private themeService: ThemeService) {
    themeService.currentTheme$
      .subscribe(theme => this.isDark = ThemeService.isDark(theme));
  }
  // Listeners
  @HostListener('window:scroll', ['$event']) onScrollEvent(_) {
    const scrollHeight = window.pageYOffset;
    const height = window.innerHeight;
    const desiredHeight = 0.2 * height;
    this.isTop = !(scrollHeight <= desiredHeight);
  }
}
