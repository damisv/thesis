import { Injectable } from '@angular/core';
import {ProgressBarService} from './progressbar.service';
import {Router} from '@angular/router';
import {User} from '../models/user';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/isEmpty';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {MatDialog} from '@angular/material';
import {HttpMethods} from '../utils/utils';
import {filter} from 'rxjs/operators';

@Injectable()
export class UserService {
  private user = new BehaviorSubject<User>(new User('default'));
  user$ = this.user.asObservable();

  constructor(private http: HttpClient,
              private progressBarService: ProgressBarService,
              private router: Router,
              private dialog: MatDialog) {}

  giveUserProfile(user: User) { this.user.next(user); }
/*
User Calls to API
 */
  getUser() {
    const req = new HttpRequest(HttpMethods.Get, 'user');
    this.makeRequest(req)
      .subscribe(
        res => { this.user.next(res); },
        err => { this.router.navigate(['auth', 'signin']); console.log(err); }
      );
  }

 edit(user: User) {
      const req = new HttpRequest(HttpMethods.Put, 'user', JSON.stringify({user: user}));
      return this.makeRequest(req);
  }

  userIsRegistered(email: string) {
    const req = new HttpRequest(HttpMethods.Get, 'user/isRegistered' + email);
    return this.makeRequest(req);
  }

  /*
 Other User Calls to API
 */
  getFor(email: string) {
    const req = new HttpRequest(HttpMethods.Get, 'user' + email);
    return this.makeRequest(req);
  }

  searchFor(email: Observable<string>) {
    return email.debounceTime(400)
      .pipe(filter(value => value !== null || value !== undefined || value.trim().length !== 0)) // blank, null or undefined don't pass
      .switchMap(val => this.search(val));
  }
  private search(value: string) {
    console.log('Search' + value);
    const req = new HttpRequest(HttpMethods.Get, 'user/search/' + value);
    return this.makeRequest(req);
  }

  private makeRequest(req: HttpRequest<any>): Observable<any> {
    this.progressBarService.availableProgress(true);
    return this.http.request(req)
      .finally( () => this.progressBarService.availableProgress(false));
  }
}
