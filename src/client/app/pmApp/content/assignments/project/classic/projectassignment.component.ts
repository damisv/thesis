import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Task, TaskType} from '../../../../../models/task';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Project} from '../../../../../models/project';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {applyFilter, FilterOption, FilterType} from '../../../../../utils/utils';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-pmapp-project-assignments-single',
  templateUrl: './projectassignment.component.html',
  styleUrls: ['./projectassignment.component.scss']
})
export class ProjectAssignmentComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  taskType = TaskType;
  types = Object.keys(TaskType);
  filterType = FilterType;

  displayedColumns = ['status', 'type', 'name', 'assigner_email', 'assignee', 'end_date'];
  dataSource = new MatTableDataSource<Task>([
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of First Issue', '', ['test@test.com', 'test@test12.com']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Second Issue', '', ['test@test.com', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Third Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fourth Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fifth Task', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Sixth Issue', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of First Issue', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Second Issue', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Third Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fourth Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fifth Task', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Sixth Issue', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of First Issue', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Second Issue', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Third Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fourth Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fifth Task', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Sixth Issue', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of First Issue', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Second Issue', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Third Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fourth Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fifth Task', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Sixth Issue', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of First Issue', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Second Issue', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Third Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fourth Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fifth Task', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Sixth Issue', '', ['', ''])
  ]);
  project: Project;

  // Filter Observables
  nameFilter = new BehaviorSubject<FilterOption>({type: FilterType.name, value: ''});
  typeFilter = new BehaviorSubject<FilterOption>({type: FilterType.type, value: 'all'});
  statusFilter = new BehaviorSubject<FilterOption>({type: FilterType.status, value: 'all'});

  constructor(private route: ActivatedRoute) {
    // FilterPredicate is the function that runs when table data is filtering
    this.dataSource.filterPredicate =
      (data: Task, filter: string) => applyFilter(JSON.parse(filter), data);
    // Three Observables for the latest value changes on the front filters (the ones above table data).
    Observable.combineLatest(this.nameFilter.asObservable().pipe(map( value => new FilterOption(value.type, value.value))),
      this.typeFilter.asObservable().pipe(map( value => new FilterOption(value.type, value.value))),
      this.statusFilter.asObservable().pipe(map( value => new FilterOption(value.type, value.value))),
      (name: FilterOption, type: FilterOption, status: FilterOption) => ({name, type, status}))
        .subscribe( filters => this.filterBy(FilterType.nameTypeStatus, filters));
  }

  // Method which is called for filtering
  /// The value given is a string because FilterPredicate receives string only
  private filterBy(type: FilterType, value) { this.dataSource.filter = JSON.stringify(new FilterOption(type, value)); }

  ngAfterViewInit() { this.dataSource.paginator = this.paginator; }

  openTask(id: string) { console.log(id); }
}
