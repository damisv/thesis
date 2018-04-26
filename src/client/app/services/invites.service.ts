import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {getHeaders, HttpMethods} from '../utils/utils';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Error} from '../models/error';
import {ErrorDialogComponent} from '../errors/errordialog.component';
import {Observable} from 'rxjs/Observable';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ProgressBarService} from './progressbar.service';
import {UserService} from './user.service';

@Injectable()
export class InviteService {

  private invites = new BehaviorSubject<object[]>([]);
  invites$ = this.invites.asObservable();

  constructor(private http: HttpClient,
              private userService: UserService,
              private progressBarService: ProgressBarService,
              private dialog: MatDialog) {
    // this.userService.user$.subscribe( _ => this.getUserInvites());
  }

  // Public methods
  acceptInvite(projectID: string) {
    const req = new HttpRequest(HttpMethods.Patch, 'invite/' + projectID, {headers: getHeaders()});
    return this.makeRequest(req)
      .map(res => res.json());
  }

  rejectInvite(projectID: string) {
    const req = new HttpRequest(HttpMethods.Delete, 'invite/' + projectID, {headers: getHeaders()});
    return this.makeRequest(req)
      .map(res => res.json());
  }

  removeInvite(index: number) { this.invites.getValue().splice(index, 1); } // removes invite from array

  getUserInvites() {
    const req = new HttpRequest(HttpMethods.Get, 'invite', {headers: getHeaders()});
    this.makeRequest(req)
      .map(res => res.json())
      .subscribe( res => this.invites.next(res));
  }

  getProjectInvites(projectID: string) {
    const req = new HttpRequest(HttpMethods.Get, 'invite/' + projectID, {headers: getHeaders()});
    return this.makeRequest(req)
      .map(res => res.json());
  }

  invite(invites: string[], projectID: string) {
    const req = new HttpRequest(HttpMethods.Post, 'invite', {invites: invites, projectID: projectID}, {headers: getHeaders()});
    return this.makeRequest(req)
      .map(res => res.json());
  }

  userIsInvited(email: string, projectID: string) {
    const req = new HttpRequest(HttpMethods.Post, 'invite/exist', {email: email, projectID: projectID}, {headers: getHeaders()});
    return this.makeRequest(req)
      .map(res => res.json());
  }
  // Private methods
  private makeRequest(req: HttpRequest<any>): Observable<any> {
    this.progressBarService.availableProgress(true);
    return this.http.request(req)
      .catch( err => {
        this.throwError(err.json());
        return Observable.throw(err);
      })
      .finally( () => this.progressBarService.availableProgress(false));
  }

  private throwError(error) {
    this.progressBarService.availableProgress(false);
    const errorData = new Error(error.title, error.error.message);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = errorData;
    const dialogError = this.dialog.open(ErrorDialogComponent, dialogConfig);
    dialogError.afterClosed().subscribe(_ => {});
  }
}
