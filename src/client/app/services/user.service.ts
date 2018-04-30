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
  // Static Properties
  private static base = 'api/user';

  // Rx Properties
  private user = new BehaviorSubject<User>(new User('default'));
  user$ = this.user.asObservable();

  constructor(private http: HttpClient,
              private router: Router) {}

  giveUserProfile(user: User) { this.user.next(user); }
/*
User Calls to API
 */
  getUser() {
    this.http.get<User>(UserService.base)
      .subscribe(
        res => this.user.next(res),
        err => this.router.navigate(['auth', 'signin'])
      );
  }

 edit(user: User): Observable<any> {
    return this.http.put(UserService.base, {user: user});
  }

  userIsRegistered(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${UserService.base}/isRegistered` + email);
  }

  /*
 Other User Calls to API
 */
  getFor(email: string): Observable<User> {
    return this.http.get<User>(`${UserService.base}/` + email);
  }

  searchFor(email: Observable<string>): Observable<User[]> {
    return email.debounceTime(400)
      .pipe(filter(value => value !== null || value !== undefined || value.trim().length !== 0)) // blank, null or undefined don't pass
      .switchMap(val => this.search(val));
  }
  private search(value: string): Observable<User[]> {
    console.log('Search' + value);
    return this.http.get<User[]>(`${UserService.base}/search/` + value);
  }
}
