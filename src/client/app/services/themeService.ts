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
  constructor() {}
  private _currentTheme = new BehaviorSubject<MaterialTheme>(MaterialTheme.light);
  currentTheme = this._currentTheme.asObservable();
}
