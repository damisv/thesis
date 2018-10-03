import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Task, TaskType} from '../../../../models/task';
import {TaskService} from '../../../../services/task.service';
import {SnackbarService} from '../../../../services/snackbar.service';
import {UserService} from '../../../../services/user.service';
import {User} from '../../../../models/user';
import {Subject} from 'rxjs/Subject';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs/Observable';
import {map, startWith} from 'rxjs/operators';
import {areDatesCorrect} from '../../../../utils/utils';
import {Member, Project} from '../../../../models/project';
import {ProjectService} from '../../../../services/projects.service';

@Component({
  selector: 'app-pmapp-project-assignment-view',
  templateUrl: './viewassignment.component.html',
  styleUrls: ['./viewassignment.component.scss']
})
export class ViewAssignmentComponent implements OnInit {
  step = 0;
  taskType = TaskType;

  user: User;
  projectTeam: Member[] = [];
  assignment = new Task(TaskType.task);

  // Assignees
  separatorKeysCodes = [COMMA];
  filteredTeam: Observable<string[]>;
  searchTerm$ = new Subject<string>();

  constructor(private route: ActivatedRoute,
              private taskService: TaskService,
              private userService: UserService,
              private projectService: ProjectService,
              private snackBar: SnackbarService) {
    this.route.params.subscribe( params => {
      this.taskService.getBy(params['id'])
        .subscribe( values => {
          this.assignment = values;
          Observable.zip(this.userService.user$,
            this.projectService.getProject(values.project_id),
            (user: User, project: Project) => ({user: user, project: project}))
            .subscribe(res => {
              this.projectTeam = res.project.team;
              this.user = res.user;
            });
          },
          _ => this.snackBar.show('Error occurred retrieving this assignment.'));
    });
  }

  hasRights() {
    if (!this.user) { return; }
    return (this.assignment.assigner_email === this.user.email ||
      this.assignment.assignee_email.filter(value => value === this.user.email).length > 0);
  }

  ngOnInit() {
    this.filteredTeam = this.searchTerm$.pipe(
      startWith(''),
      map(val => this.filter(val))
    );
  }

  filter(val: string): string[] {
    return this.projectTeam.map(value => value.email).filter(member =>
      member.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  onKeyUp(event) {
    if (!this.hasRights) {
      this.snackBar.show('You don\'t have the necessary rights to do that.');
      return;
    }
    if (event.which <= 90 && event.which >= 48) { this.searchTerm$.next(event.target.value); }
  }

  // Add assignees and chips
  add(input, email): void {
    if (!(email || '').trim()) { return; }
    if (this.assignment.assignee_email.indexOf(email) !== -1) {
      this.snackBar.show(`${email} has been already assigned`);
      return;
    }
    if (this.projectTeam.filter(member => member.email === email).length === 0) {
      this.snackBar.show(`${email} is not a member of this project`);
      return;
    }
    this.assignment.assignee_email.push(email.trim());
    if (input) { input.value = ''; }
  }

  remove(index: number) {
    if (!this.hasRights) {
      this.snackBar.show('You don\'t have the necessary rights to do that.');
      return;
    }
    if (index >= 0) { this.assignment.assignee_email.splice(index, 1); }
  }

  onSave() {
    if (!this.hasRights) {
      this.snackBar.show('You don\'t have the necessary rights to do that.');
      return;
    }
    if (!(this.assignment.name || '').trim()) {
      this.snackBar.show('Check name for this task.');
      return;
    }
    if (!areDatesCorrect(this.assignment.date_start, this.assignment.date_end)) {
      this.snackBar.show('Check dates before proceeding.');
      return;
    }
    this.taskService.edit(this.assignment)
      .subscribe( res => {
        this.taskService.getFor(this.assignment.project_id);
        this.snackBar.show('Assignment Updated');
        },
          error => this.snackBar.show('Updating assignment failed.Try again.'));
  }

  changeStatus() {
    if (!this.hasRights) {
      this.snackBar.show('You don\'t have the necessary rights to do that.');
      return;
    }
    this.taskService.changeStatus(this.assignment)
      .subscribe(_ => {}, err => console.log(err));
  }

  // Expansion Panels methods
  setStep(index: number) { this.step = index; }
  nextStep() { this.step++; }
  prevStep() { this.step--; }
}
