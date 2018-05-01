import {Component, EventEmitter, Input, Output} from '@angular/core';
import {InviteService} from '../../../services/invites.service';
import {UserService} from '../../../services/user.service';
import {Subject} from 'rxjs/Subject';
import { Project } from '../../../models/project';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import {SnackbarService} from '../../../services/snackbar.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {User} from '../../../models/user';

@Component({
  selector: 'app-invite-member',
  template: `<mat-form-field>
    <mat-chip-list #chipList>
      <mat-chip *ngFor="let member of project?.team; let i = index;" selectable="true"
                removable="true" (remove)="remove(i)">
        {{member.email}}
        <mat-icon matChipRemove>cancel</mat-icon>
      </mat-chip>

      <input #addAssignee placeholder="Add members to invite" matInput
             [matAutocomplete]="teamAuto"
             [matChipInputFor]="chipList"
             [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
             (matChipInputTokenEnd)="add($event.input, $event.value)"
             (keyup)="searchTerm$.next($event.target.value)">
      <mat-autocomplete #teamAuto="matAutocomplete">
        <mat-option *ngFor="let member of membersAutocomplete | async" (click)="add(addAssignee, member.email)" [value]="member.email">
          {{ member.email }}
        </mat-option>
      </mat-autocomplete>
    </mat-chip-list>
  </mat-form-field>`
})
export class InviteMemberComponent {

  @Input() project: Project;
  @Input() userEmail: string;
  @Output() getTeam = new EventEmitter<string[]>();

  separatorKeysCodes = [ENTER, COMMA];
  searchTerm$ = new Subject<string>();
  membersAutocomplete = new Subject<User[]>();
  team = [];

  constructor (private inviteService: InviteService,
               private userService: UserService,
               private snackBar: SnackbarService) {
    this.userService.searchFor(this.searchTerm$)
      .subscribe( value => this.membersAutocomplete.next(value));
  }

  add(input, email) {
    if (!(email || '').trim()) {
      this.snackBar.show('Not a valid email.');
      return;
    }
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
    for (const invite of this.team) {
      if (invite === email) {
        this.snackBar.show(invite + 'already queued for invite');
        return;
      }
    }
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
        this.team.push(email);
        this.getTeam.emit(this.team);
        if (input) { input.value = ''; }
      },
      err => this.snackBar.show('Error occurred on searching email'));
  }

  remove(index: number) {
    if (index >= 0) {
      this.team.splice(index, 1);
      this.getTeam.emit(this.team);
    }
  }
}
