import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {ProgressBarService} from './progressbar.service';
import {Account} from '../models/account';
import {HttpMethods} from '../utils/utils';
import {User} from '../models/user';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

@Injectable()
export class AuthService {
  // Static properties
  private static  signInUrl = 'api/auth/signin';
  private static signUpUrl = 'api/auth/signup';
  // Initializations
  constructor(private http: HttpClient) {}
  // Public api methods
  signUp(account: Account, user: User): Observable<any> {
    return this.http.post(AuthService.signUpUrl, {account: account, user: user});
  }
  signIn(account: Account): Observable<any> {
    return this.http.post(AuthService.signInUrl, {account: account});
  }

  // Public methods
  public isAuthenticated(): boolean {
    // const token = localStorage.getItem('token');
    // return !this.jwtHelper.isTokenExpired(token);
    return localStorage.getItem('token') !== null || localStorage.getItem('token') !== undefined;
  }
}
