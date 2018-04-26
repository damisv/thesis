import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import {MaterialTheme, ThemeService} from './services/theme.service';
import {distinctUntilChanged} from 'rxjs/operators';
import {ProgressBarService} from './services/progressbar.service';

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
  isRunningQuery: boolean;

  constructor(private overlayContainer: OverlayContainer,
              @Inject(PLATFORM_ID) private platform: Object,
              private themeService: ThemeService,
              private progressBar: ProgressBarService) {
      themeService.currentTheme$
        .pipe(distinctUntilChanged())
        .subscribe(theme => {
          this.theme = theme;
          overlayContainer.getContainerElement().classList.add(theme); // overlay container don't change the background color by itself
        });
      progressBar.progressBar$
        .subscribe( state => this.isRunningQuery = state);
  }
}


