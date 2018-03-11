import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';

export enum MaterialTheme {
  light = 'light-theme',
  dark = 'dark-theme',
  purpleLight = 'light-purple',
  purpleDark = 'dark-purple'
}

@Injectable()
export class ThemeService {
  constructor() {}
  private _currentTheme = new BehaviorSubject<MaterialTheme>(MaterialTheme.dark);
  currentTheme = this._currentTheme.asObservable();
}
