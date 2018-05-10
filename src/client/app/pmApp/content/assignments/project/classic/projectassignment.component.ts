import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatPaginator} from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import {map} from 'rxjs/operators';
import {ProjectService, SnackbarService, TaskService, UserService} from '../../../../../services';
import {Task, TaskType, Project, User} from '../../../../../models';
import { FilterOption, FilterType} from '../../../../../utils/utils';
import {MyDataSource} from '../../../../../utils/customGenerics';

@Component({
  selector: 'app-pmapp-project-assignments-single',
  templateUrl: './projectassignment.component.html',
  styleUrls: ['./projectassignment.component.scss']
})
export class ProjectAssignmentComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  user: User;

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
              private userService: UserService,
              private snackBar: SnackbarService,
              private taskService: TaskService) { userService.user$.subscribe(user => this.user = user); }

  ngOnInit() {
    this.dataSource = new MyDataSource(this.taskService.assignments$, this.paginator);
    Observable.combineLatest(this.nameFilter.asObservable().pipe(map( value => new FilterOption(value.type, value.value))),
      this.typeFilter.asObservable().pipe(map( value => new FilterOption(value.type, value.value))),
      this.statusFilter.asObservable().pipe(map( value => new FilterOption(value.type, value.value))),
      (name: FilterOption, type: FilterOption, status: FilterOption) => ({name, type, status}))
      .subscribe( filters => this.dataSource.filter = new FilterOption(FilterType.nameTypeStatus, filters));
  }

  openTask(id: string) { this.router.navigate(['app', 'project', 'assignmentview', id]); }

  hasRights(task: Task) {
    return task.assigner_email !== this.user.email || task.assignee_email.filter(email => email === this.user.email).length === 0;
  }

  changeStatusOf(task: Task) {
    if (task.assigner_email !== this.user.email || task.assignee_email.filter(email => email === this.user.email).length === 0) {
      this.snackBar.show('You have no rights upon this task');
      return;
    }
    this.taskService.changeStatus(task)
      .subscribe(_ => {}, err => console.log(err));
  }
}
