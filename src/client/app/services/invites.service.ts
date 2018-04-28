import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {HttpMethods} from '../utils/utils';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import {ProgressBarService} from './progressbar.service';
import {UserService} from './user.service';

@Injectable()
export class InviteService {

  private invites = new BehaviorSubject<object[]>([]);
  invites$ = this.invites.asObservable();

  constructor(private http: HttpClient,
              private userService: UserService,
              private progressBarService: ProgressBarService) {
    // this.userService.user$.subscribe( _ => this.getUserInvites());
  }

  // Public methods
  acceptInvite(projectID: string) {
    const req = new HttpRequest(HttpMethods.Patch, 'invite/' + projectID, {});
    return this.makeRequest(req);
  }

  rejectInvite(projectID: string) {
    const req = new HttpRequest(HttpMethods.Delete, 'invite/' + projectID);
    return this.makeRequest(req);
  }

  removeInvite(index: number) {
    this.invites.getValue().splice(index, 1);
  } // removes invite from array

  getUserInvites() {
    const req = new HttpRequest(HttpMethods.Get, 'invite');
    this.makeRequest(req)
      .subscribe(res => this.invites.next(res));
  }

  getProjectInvites(projectID: string) {
    const req = new HttpRequest(HttpMethods.Get, 'invite/' + projectID);
    return this.makeRequest(req);
  }

  invite(invites: string[], projectID: string) {
    const req = new HttpRequest(HttpMethods.Post, 'invite', JSON.stringify({invites: invites, projectID: projectID}));
    return this.makeRequest(req);
  }

  userIsInvited(email: string, projectID: string) {
    const req = new HttpRequest(HttpMethods.Post, 'invite/isInvited', JSON.stringify({email: email, projectID: projectID}));
    return this.makeRequest(req);
  }

  // Private methods
  private makeRequest(req: HttpRequest<any>): Observable<any> {
    this.progressBarService.availableProgress(true);
    return this.http.request(req)
      .finally(() => this.progressBarService.availableProgress(false));
  }
}
