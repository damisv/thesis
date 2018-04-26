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
import {Member} from '../../../../models/project';

@Component({
  selector: 'app-pmapp-project-assignment-view',
  templateUrl: './viewassignment.component.html',
  styleUrls: ['./viewassignment.component.scss']
})
export class ViewAssignmentComponent implements OnInit {
  step = 0;
  taskType = TaskType;

  user = new User('');
  projectTeam: Member[] = [];
  assignment = new Task(TaskType.task);
  hasRights = false;

  // Assignees
  separatorKeysCodes = [ENTER, COMMA];
  filteredTeam: Observable<string[]>;
  searchTerm$ = new Subject<string>();

  constructor(private route: ActivatedRoute,
              private taskService: TaskService,
              private userService: UserService,
              private snackBar: SnackbarService) {
    this.route.params.subscribe( params => {
      this.taskService.getBy(params['id'])
        .subscribe( values => {
          this.assignment = values.assignment;
          this.projectTeam = values.team;
          },
            error => {
              this.snackBar.show('Error occurred retrieving this assignment.');
              this.hasRights = false;
            });
    });
    this.userService.user$.subscribe(user => {
      this.user = user;
      this.hasRights = this.assignment.hasRights(user.email);
    });
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

  // Add assignees and chips
  add(input, value): void {
    if ((value || '').trim()) {
      if (this.assignment.assignee_email.findIndex(value) === -1) {
        this.assignment.assignee_email.push(value.trim());
      }
    }
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
    if (this.assignment.hasRights(this.user.email)) {
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
      .subscribe( res => this.snackBar.show('Assignment Updated'),
                error => this.snackBar.show('Updating assignment failed.Try again.'));
  }

  // Expansion Panels methods
  setStep(index: number) { this.step = index; }
  nextStep() { this.step++; }
  prevStep() { this.step--; }
}
