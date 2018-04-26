import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';

export enum MaterialTheme {
  light = 'light-theme',
  dark = 'dark-theme',
  purpleLight = 'light-purple-theme',
  purpleDark = 'dark-purple-theme'
}

@Injectable()
export class ThemeService {
  // Rx
  private currentTheme = new BehaviorSubject<MaterialTheme>(MaterialTheme.light);
  currentTheme$ = this.currentTheme.asObservable();

  // Static functions
  static isDark(theme: MaterialTheme): boolean {
    return theme === MaterialTheme.dark || theme === MaterialTheme.purpleDark;
  }

  constructor() {}

  changeTheme(theme: MaterialTheme) { this.currentTheme.next(theme); }
}
