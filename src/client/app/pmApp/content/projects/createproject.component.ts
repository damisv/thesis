import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProjectService} from '../../../services/projects.service';
import {UserService} from '../../../services/user.service';
import {MatInput, MatSnackBar} from '@angular/material';
import {Member, Project, ProjectPosition} from '../../../models/project';
import {User} from '../../../models/user';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {Subject} from 'rxjs/Subject';
import {SnackbarService} from '../../../services/snackbar.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-pmapp-createproject',
  templateUrl: './createproject.component.html',
  styleUrls: ['./createproject.component.scss']
})
export class CreateprojectComponent implements OnInit {
  step = 0;
  @Input() user: User;
  @Output() projectCreated = new EventEmitter<Project>();

  firstFormGroup: FormGroup;
  separatorKeysCodes = [COMMA];
  searchTerm$ = new Subject<string>();

  // Properties
  project: Project = new Project('');
  membersToInvite: string[] = [];
  membersAutocomplete = new Subject<User[]>();

  constructor (private _formBuilder: FormBuilder,
               private userService: UserService,
               private projectService: ProjectService,
               public snackBar: SnackbarService) {
    this.userService.searchFor(this.searchTerm$)
      .subscribe( value => this.membersAutocomplete.next(value));
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      'projectName': ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.project.name === '') { return; }
    this.project.team = [new Member(ProjectPosition.manager, this.user.email)];
    this.projectService.create(this.project, this.membersToInvite)
      .subscribe(res => {
        console.log('RES ---------------', res);
          this.projectCreated.emit(res.project);
        },
        error => {
          // this.notificationService.create("error",this.project.name,"Error! Project was not created!","error");
        }
      );
  }

  onKeyUp(event) { if (event.which <= 90 && event.which >= 48) { this.searchTerm$.next(event.target.value); }}

  changeProjectPrivacyType(status) { this.project.typeOf = status ? 'private' : 'public'; }

  // Invite new members
  add(input, email) {
    if (!(email || '').trim()) {
      this.snackBar.show('Not a valid email.');
      return;
    }
    if (email === this.user.email) {
      this.snackBar.show('You cannot invite yourself to this project');
      return;
    }
    for (const invite of this.membersToInvite) {
      if (invite === email) {
        this.snackBar.show(invite + 'already queued for invite');
        return;
      }
    }
    this.userService.userIsRegistered(email)
      .subscribe(isRegistered => {
          if (!isRegistered) {
            this.snackBar.show(email + 'does not exist');
            return;
          }
          this.membersToInvite.push(email);
          if (input) { input.value = ''; }
        },
        err => this.snackBar.show('Error occurred on searching email'));
  }

  remove(index: number) { if (index >= 0) { this.membersToInvite.splice(index, 1); } }

  // Expansion Panels methods
  setStep(index) { this.step = index; }
  nextStep() { this.step++; }
  prevStep() { this.step--; }
}
