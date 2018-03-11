import {Component} from '@angular/core';
import {MaterialTheme, ThemeService} from '../services/themeService';
import {distinctUntilChanged} from 'rxjs/operators';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  isDark = false;
  constructor(private themeService: ThemeService) {
    themeService.currentTheme.pipe(distinctUntilChanged())
      .subscribe(theme => this.isDark = this.isThemeDark(theme));
  }

  private isThemeDark(theme: MaterialTheme): boolean {
    return theme === MaterialTheme.dark || theme === MaterialTheme.purpleDark;
  }
}
