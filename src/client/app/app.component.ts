import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import {MaterialTheme, ThemeService} from './services/themeService';
import {distinctUntilChanged} from 'rxjs/operators';

/**
 * This is the base component of the application.
 * @preferred
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  theme = MaterialTheme.light;

  constructor(private overlayContainer: OverlayContainer,
              @Inject(PLATFORM_ID) private platform: Object,
              private themeService: ThemeService) {
      themeService.currentTheme
        .pipe(distinctUntilChanged())
        .subscribe(theme => this.theme = theme);
  }
}


