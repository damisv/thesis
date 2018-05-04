import { Injectable } from '@angular/core';
import {Router, Route, CanLoad} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(public auth: AuthService,
              public router: Router) {}

  canLoad(route: Route): boolean {
    const url: string = route.path;
    console.log('Url:' + url);
    try {
      if (localStorage) {if (localStorage.getItem('token') !== null) { return true; }}
    } catch (e) {
      console.log('huh');
    }
    this.router.navigate(['auth/signin']);
    return false;
  }
}
