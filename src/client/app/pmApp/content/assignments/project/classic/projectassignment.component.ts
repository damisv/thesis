import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Task, TaskType} from '../../../../../models/task';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Project} from '../../../../../models/project';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {applyFilter, FilterOption, FilterType} from '../../../../../utils/utils';
import {map} from 'rxjs/operators';
import {ProjectService} from '../../../../../services/projects.service';
import {TaskService} from '../../../../../services/task.service';
import {Subscription} from 'rxjs/Subscription';

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
  dataSource = new MatTableDataSource<Task>();
  project: Project;
  projectSubscription: Subscription = this.projectService.project$
    .subscribe( project => this.project = project);
  taskSubscription = this.taskService.assignments$
    .subscribe( assignments => this.dataSource.data = assignments);

  // Filter Observables
  nameFilter = new BehaviorSubject<FilterOption>({type: FilterType.name, value: ''});
  typeFilter = new BehaviorSubject<FilterOption>({type: FilterType.type, value: 'all'});
  statusFilter = new BehaviorSubject<FilterOption>({type: FilterType.status, value: 'all'});

  constructor(private route: ActivatedRoute,
              private router: Router,
              private projectService: ProjectService,
              private taskService: TaskService) {
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

  openTask(id: string) { this.router.navigate(['assignmentview/' + id]); }

  changeStatusOf(task: Task) {
    this.taskService.changeStatus(task)
      .subscribe( res => this.taskService.changeStatusOf(task._id, task.completed));
  }
}
