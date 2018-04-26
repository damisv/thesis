import {AfterViewInit, Component, HostListener, OnDestroy} from '@angular/core';
import {MaterialTheme, ThemeService} from '../services/theme.service';
import {distinctUntilChanged} from 'rxjs/operators';
import {ScrollService} from '../services/scroll.service';
import {ObservableMedia} from '@angular/flex-layout';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {
  // Properties
  isDark = false;
  isTop = false;
  isMobile: Boolean;
  // Initializations
  constructor(private themeService: ThemeService,
              private scrollService: ScrollService,
              private media: ObservableMedia) {
    themeService.currentTheme$.pipe(distinctUntilChanged())
      .subscribe(theme => this.isDark = ThemeService.isDark(theme));
  }
  ngAfterViewInit() {
    this.menuMobile();
    this.media.subscribe((_) => this.menuMobile());
  }
  // Private functions
  private menuMobile() {
    this.isMobile = this.media.isActive('sm') ? true : this.media.isActive('xs');
  }
  // Public functions
  public scrollTo(target: string) {
    this.scrollService.triggerScrollTo(target);
  }
  // Listeners
  @HostListener('window:scroll', ['$event']) onScrollEvent(_) {
    const scrollHeight = window.pageYOffset;
    const height = window.innerHeight;
    const desiredHeight = 0.2 * height;
    this.isTop = !(scrollHeight <= desiredHeight);
  }
}
