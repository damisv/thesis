import {Component} from '@angular/core';
import {ProjectService} from '../../../services/projects.service';
import {Subscription} from 'rxjs/Subscription';
import {Project} from '../../../models/project';
import {InviteService} from '../../../services/invites.service';
import {UserService} from '../../../services/user.service';
import {SnackbarService} from '../../../services/snackbar.service';
import {Subject} from 'rxjs/Subject';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {User} from '../../../models/user';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

@Component({
  selector: 'app-pmapp-project-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent {
  displayedColumns = ['no.', 'name', 'position', 'remove'];

  project: Project;
  projectSubscription: Subscription = this.projectService.project$.subscribe(project => this.project = project);
  userEmail: string;
  userSubscription: Subscription = this.userService.user$.subscribe( user => this.userEmail = user.email);

  separatorKeysCodes = [ENTER, COMMA];
  searchTerm$ = new Subject<string>();
  membersAutocomplete = new Subject<User[]>();
  team = [];

  constructor(private userService: UserService,
              private projectService: ProjectService,
              private inviteService: InviteService,
              private snackBar: SnackbarService) {
    this.userService.searchFor(this.searchTerm$)
      .subscribe( value => this.membersAutocomplete.next(value));
  }

  onKeyUp(event) { if (event.which <= 90 && event.which >= 48) { this.searchTerm$.next(event.target.value); }}

  onInvite() {
    if (this.team.length < 1) {
      this.snackBar.show('No members to invite');
      return;
    }
    this.inviteService.invite(this.team, this.project._id)
      .subscribe(
        () => {console.log('success members invited'); }, // members invited
        err => {}// this.notificationService.create("error"," Error Invite failed","Error! Unable to send invite to "+email,"error");
      );
  }

  // Invite new members
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
          if (input) { input.value = ''; }
        },
        err => this.snackBar.show('Error occurred on searching email'));
  }

  removeMember(email: string, index: number) {
    this.projectService.removeMember(email, this.project._id)
      .subscribe(res => this.projectService.remove(index));
  }

  // Remove chip
  remove(index: number) {
    if (index >= 0) { this.team.splice(index, 1); }
  }
}
