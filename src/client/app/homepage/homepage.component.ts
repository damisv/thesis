import {Component, HostListener} from '@angular/core';
import {MaterialTheme, ThemeService} from '../services/themeService';
import {distinctUntilChanged} from 'rxjs/operators';
import {ScrollService} from '../services/scrollService';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  // Properties
  isDark = false;
  isTop = false;
  // Initializations
  constructor(private themeService: ThemeService, private scrollService: ScrollService) {
    themeService.currentTheme.pipe(distinctUntilChanged())
      .subscribe(theme => this.isDark = HomepageComponent.isThemeDark(theme));
  }
  // Private functions
  private static isThemeDark(theme: MaterialTheme): boolean {
    return theme === MaterialTheme.dark || theme === MaterialTheme.purpleDark;
  }
  // Public functions
  public scrollTo(target: string) {
    this.scrollService.triggerScrollTo(target);
  }
  // Listeners
  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    const scrollHeight = window.pageYOffset;
    const height = window.innerHeight;
    const desiredHeight = 0.2 * height;
    this.isTop = !(scrollHeight <= desiredHeight);
  }
}
