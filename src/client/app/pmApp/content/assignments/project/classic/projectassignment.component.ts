import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Task, TaskType} from '../../../../../models/task';
import {MatPaginator} from '@angular/material';
import {Project} from '../../../../../models/project';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {map} from 'rxjs/operators';
import {ProjectService} from '../../../../../services/projects.service';
import {TaskService} from '../../../../../services/task.service';
import {Subscription} from 'rxjs/Subscription';
import { FilterOption, FilterType} from '../../../../../utils/utils';
import {MyDataSource} from '../../../../../utils/customGenerics';

@Component({
  selector: 'app-pmapp-project-assignments-single',
  templateUrl: './projectassignment.component.html',
  styleUrls: ['./projectassignment.component.scss']
})
export class ProjectAssignmentComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  taskType = TaskType;
  types = Object.keys(TaskType);
  filterType = FilterType;

  displayedColumns = ['status', 'type', 'name', 'assigner_email', 'assignee', 'end_date'];
  dataSource: MyDataSource<Task> | null;

  project: Project;
  projectSubscription: Subscription = this.projectService.project$
    .subscribe( project => this.project = project);

  // Filter Observables
  nameFilter = new BehaviorSubject<FilterOption>({type: FilterType.name, value: ''});
  typeFilter = new BehaviorSubject<FilterOption>({type: FilterType.type, value: 'all'});
  statusFilter = new BehaviorSubject<FilterOption>({type: FilterType.status, value: 'all'});

  constructor(private route: ActivatedRoute,
              private router: Router,
              private projectService: ProjectService,
              private taskService: TaskService) {}

  ngOnInit() {
    this.dataSource = new MyDataSource(this.taskService.assignments$, this.paginator);
    Observable.combineLatest(this.nameFilter.asObservable().pipe(map( value => new FilterOption(value.type, value.value))),
      this.typeFilter.asObservable().pipe(map( value => new FilterOption(value.type, value.value))),
      this.statusFilter.asObservable().pipe(map( value => new FilterOption(value.type, value.value))),
      (name: FilterOption, type: FilterOption, status: FilterOption) => ({name, type, status}))
      .subscribe( filters => this.dataSource.filter = new FilterOption(FilterType.nameTypeStatus, filters));
  }

  openTask(id: string) {
    console.log(id);
    this.router.navigate(['app', 'assignmentview', id]);
  }

  changeStatusOf(task: Task) {
    this.taskService.changeStatus(task)
      .subscribe( res => this.taskService.changeStatusOf(task._id, task.completed));
  }
}
