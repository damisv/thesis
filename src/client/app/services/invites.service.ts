import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {UserService} from './user.service';
import 'rxjs/add/operator/finally';

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
    const temp = this.invites.value;
    temp.splice(index, 1);
    this.invites.next(temp);
  } // removes invite from array

  getUserInvites() {
    this.http.get<object[]>(InviteService.base).subscribe(res => this.invites.next(res));
  }

  getProjectInvites(projectID: string): Observable<any> {
    return this.http.get(`${InviteService.base}/` + projectID);
  }

  invite(invites: string[], projectID: string, projectName: string): Observable<any> {
    return this.http.post(`${InviteService.base}`, {invites: invites, projectID: projectID , projectName: projectName});
  }

  userIsInvited(email: string, projectID: string): Observable<boolean> {
    return this.http.post<boolean>(`${InviteService.base}/isInvited`, {email: email, projectID: projectID});
  }
}
