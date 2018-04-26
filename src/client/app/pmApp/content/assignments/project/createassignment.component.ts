import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {map, startWith} from 'rxjs/operators';
import {Project} from '../../../../models/project';
import {Task, TaskType} from '../../../../models/task';
import {SnackbarService} from '../../../../services/snackbar.service';
import {areDatesCorrect} from '../../../../utils/utils';

@Component({
  selector: 'app-pmapp-project-assignment-create',
  templateUrl: './createassignment.component.html',
  styleUrls: ['./createassignment.component.scss']
})
export class CreateAssignmentComponent implements OnInit {
  @Input() project: Project;
  @Output() createTask = new EventEmitter<Task>();
  assignment = new Task(TaskType.task);

  step = 0;
  taskType = TaskType;

  // Assignees
  separatorKeysCodes = [ENTER, COMMA];
  filteredTeam: Observable<string[]>;
  searchTerm$ = new Subject<string>();

  constructor(private snackBar: SnackbarService) {}

  ngOnInit() {
    this.filteredTeam = this.searchTerm$.pipe(
      startWith(''),
      map(val => this.filter(val))
    );
  }

  filter(val: string): string[] {
    return this.project.team.map(value => value.email).filter(member =>
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
    if (index >= 0) { this.assignment.assignee_email.splice(index, 1); }
  }

  onCreate() {
    if (!(this.assignment.name || '').trim()) {
      this.snackBar.show('Check name for this task.');
      return;
    }
    if (!areDatesCorrect(this.assignment.date_start, this.assignment.date_end)) {
      this.snackBar.show('Check dates before proceeding.');
      return;
    }
    this.assignment.project_id = this.project._id;
    this.assignment.project_name = this.project.name;
    this.createTask.emit(this.assignment);
  }

  // Expansion Panels methods
  setStep(index: number) { this.step = index; }
  nextStep() { this.step++; }
  prevStep() { this.step--; }
}
