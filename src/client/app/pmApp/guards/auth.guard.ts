import { Injectable } from '@angular/core';
import {Router, Route, CanLoad} from '@angular/router';
import {AuthService, tokenExists} from '../../services/auth.service';

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(public auth: AuthService,
              public router: Router) {}

  canLoad(route: Route): boolean {
    const url: string = route.path;
    console.log('Url:' + url);
    if (tokenExists) { return true; }
    this.router.navigate(['auth/signin']);
    return false;
  }
}
