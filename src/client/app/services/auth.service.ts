import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Account} from '../models/account';
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
}
