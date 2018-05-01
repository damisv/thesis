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
  // Static Properties
  private static base = 'api/invite';

  // Rx Properties
  private invites = new BehaviorSubject<object[]>([]);
  invites$ = this.invites.asObservable();

  constructor(private http: HttpClient,
              private userService: UserService) {
    this.userService.user$.subscribe( _ => this.getUserInvites());
  }

  // Public methods
  acceptInvite(projectID: string): Observable<any> {
    return this.http.patch(`${InviteService.base}/` + projectID, {});
  }

  rejectInvite(projectID: string): Observable<any> {
    return this.http.delete(`${InviteService.base}/` + projectID);
  }

  removeInvite(index: number) {
    this.invites.getValue().splice(index, 1);
  } // removes invite from array

  getUserInvites() {
    this.http.get<object[]>(InviteService.base).subscribe(res => this.invites.next(res));
  }

  getProjectInvites(projectID: string): Observable<any> {
    return this.http.get(`${InviteService.base}/` + projectID);
  }

  invite(invites: string[], projectID: string): Observable<any> {
    return this.http.post(InviteService.base, {invites: invites, projectID: projectID});
  }

  userIsInvited(email: string, projectID: string): Observable<boolean> {
    return this.http.post<boolean>(`${InviteService.base}/isInvited`, {email: email, projectID: projectID});
  }
}
