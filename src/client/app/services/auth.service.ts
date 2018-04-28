import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {ProgressBarService} from './progressbar.service';
import {Account} from '../models/account';
import {HttpMethods} from '../utils/utils';
import {User} from '../models/user';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable()
export class AuthService {
  // Static properties
  private static  signInUrl = 'api/auth/signin';
  private static signUpUrl = 'api/auth/signup';
  // Initializations
  constructor(private http: HttpClient,
              private progressBarService: ProgressBarService,
              public jwtHelper: JwtHelperService) {
  }
  // Public api methods
  signUp(account: Account, user: User) {
    const req = new HttpRequest(HttpMethods.Post, AuthService.signUpUrl, JSON.stringify({account: account, user: user}));
    return this.makeRequest(req);
  }
  signIn(account: Account) {
    const req = new HttpRequest(HttpMethods.Post, AuthService.signInUrl, JSON.stringify(account));
    return this.makeRequest(req);
  }

  // Public methods
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  // Private methods
  private makeRequest(req: HttpRequest<any>): Observable<any> {
    this.progressBarService.availableProgress(true);
    return this.http.request(req)
        .finally( () => this.progressBarService.availableProgress(false));
  }
}
