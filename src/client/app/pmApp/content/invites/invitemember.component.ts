import {Component, EventEmitter, Input, Output} from '@angular/core';
import {InviteService} from '../../../services/invites.service';
import {UserService} from '../../../services/user.service';
import {Subject} from 'rxjs/Subject';
import {Project} from '../../../models/project';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import {SnackbarService} from '../../../services/snackbar.service';

@Component({
  selector: 'app-invite-member',
  template: `<mat-form-field>
    <input (keyup.enter)="onInvite($event.target.value)" (keyup)="searchTerm$.next($event.target.value)"
           matInput placeholder="Invite member" [matAutocomplete]="auto">
    <mat-autocomplete #auto="matAutocomplete">
      <mat-option (click)="onInvite($event.target.value)" *ngFor="let member of membersAutocomplete | async" [value]="member">
        <span>{{ member }}</span>
      </mat-option>
    </mat-autocomplete>
  </mat-form-field>`
})
export class InviteMemberComponent {

  @Input() project: Project;
  @Input() userEmail: string;
  @Output() addInvite = new EventEmitter<string>();

  searchTerm$ = new Subject<string>();
  membersAutocomplete: string[];

  constructor (private inviteService: InviteService,
               private userService: UserService,
               private snackBar: SnackbarService
               // private notificationService:NotificationService
  ) {
    this.userService.searchFor(this.searchTerm$)
      .subscribe( value => this.membersAutocomplete = value);
  }

  onInvite(email: string) {
    if (email === this.userEmail) {
      this.snackBar.show('You cannot invite yourself to this project');
      return;
    }
    for (const member of this.project.team) {
      if (member.email === email) {
        this.snackBar.show(member + 'already member');
        return;
      }
    }
    if (email == null || email === '') { return; }
    Observable.zip(this.userService.userIsRegistered(email),
      this.inviteService.userIsInvited(email, this.project._id),
      (registered: boolean, invited: boolean) => ({registered, invited}))
      .subscribe( res => {
        if (!res.registered) {
          this.snackBar.show(email + 'does not exist');
          return;
        }
        if (res.invited) {
          this.snackBar.show(email + 'already invited');
          return;
        }
        this.addInvite.emit(email);
      });
  }
}
