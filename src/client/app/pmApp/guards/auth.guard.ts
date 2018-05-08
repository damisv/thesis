import { Injectable } from '@angular/core';
import {Router, Route, CanLoad} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(public auth: AuthService,
              public router: Router) {}

  canLoad(route: Route): boolean {
    const url: string = route.path;
    console.log('Url:' + url);
    try {
      if (localStorage) {
        if (localStorage.getItem('token') !== null) {
          if (localStorage.getItem('token') !== undefined) {
            const decoded = jwt_decode(localStorage.getItem('token'));
            return decoded.exp > (new Date).getMilliseconds();
          }
        }
      }
    } catch (e) { console.log('huh'); }
    this.router.navigate(['auth/signin']);
    return false;
  }
}
