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
  membersToInvite: string[] = [];

  // Properties
  project: Project;

  constructor (private _formBuilder: FormBuilder,
               private projectService: ProjectService,
               private userService: UserService,
               public snackBar: SnackbarService,
  ) {
    this.project = new Project('');
    this.project.typeOf = 'public';
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
          this.projectCreated.emit(res.project);
        },
        error => {
          //this.notificationService.create("error",this.project.name,"Error! Project was not created!","error");
        }
      );
  }

  onInvite(team: string[]) { this.membersToInvite = team; }

  changeProjectPrivacyType(status) {
    this.project.typeOf = status ? 'private' : 'public';
  }

  // Expansion Panels methods
  setStep(index) { this.step = index; }
  nextStep() { this.step++; }
  prevStep() { this.step--; }
}
