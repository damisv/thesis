import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import { Observable } from 'rxjs/Observable';
import {Task, TaskType} from '../models/task';
import {ProgressBarService} from './progressbar.service';
import {Subject} from 'rxjs/Subject';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {getHeaders, HttpMethods} from '../utils/utils';
import {ErrorDialogComponent} from '../errors/errordialog.component';
import {Error} from '../models/error';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class TaskService {
  // Current task for editing or viewing
  private task = new Subject<Task>();
  task$ = this.task.asObservable();

  // Current Project Assignments Observables
  private assignments = new BehaviorSubject<Task[]>([]);
  assignments$ = this.assignments.asObservable();

  constructor(private http: HttpClient,
              private progressBarService: ProgressBarService,
              private dialog: MatDialog) {}

  // Get All User Task by type (task, issues, feedback)
  get(type: TaskType) {
    const req = new HttpRequest(HttpMethods.Get, 'assignments/' + TaskType[type], {headers: getHeaders()});
    return this.makeRequest(req)
      .map(res => res.json());
  }

  // Get All Project Assignments
  getFor(projectID: string) {
      const req = new HttpRequest(HttpMethods.Get, 'assignments/project/' + projectID, {headers: getHeaders()});
      return this.makeRequest(req)
        .map(res => res.json())
        .subscribe( values => this.assignments.next(values));
  }

  // Get Task by ID
  getBy(id: string) {
    const req = new HttpRequest(HttpMethods.Get, 'assignments/' + id, {headers: getHeaders()});
    return this.makeRequest(req)
      .map(res => res.json());
  }

  create(task: Task) {
    // if (typeof task.date_start !== 'undefined') { task.date_start = task.date_start.toISOString(); }
    // if (typeof task.date_end !== 'undefined') { task.date_end = task.date_end.toISOString(); }
    const req = new HttpRequest(HttpMethods.Post, 'assignments', {task: task}, {headers: getHeaders()});
    return this.makeRequest(req)
      .map(res => res.json());
  }

  edit(task: Task) {
    const req = new HttpRequest(HttpMethods.Put, 'assignments', {task: task}, {headers: getHeaders()});
    return this.makeRequest(req)
      .map(res => res.json());
  }

  changeStatus(task: Task) {
    const req = new HttpRequest(HttpMethods.Patch, 'assignments/complete/' + task._id, {headers: getHeaders()});
    return this.makeRequest(req)
      .map(res => res.json());
  }

  // Changes the status on this assignments array
  changeStatusOf(id: string, status: boolean) {
    const index = this.assignments.getValue().findIndex(value => value._id === id);
    this.assignments.getValue()[index].completed = status;
  }

  // When a task arrives through socket, this method should be called.
  add(task: Task) {
    if (localStorage.hasOwnProperty('projectID')) {
       if (task.project_id === localStorage.getItem('projectID')) { this.assignments.getValue().push(task); }
    }
  }

  private makeRequest(req: HttpRequest<any>): Observable<any> {
    this.progressBarService.availableProgress(true);
    return this.http.request(req)
      .catch( err => {
        this.throwError(err);
        return Observable.throw(err);
      })
      .finally(() => this.progressBarService.availableProgress(false));
  }

  private throwError(error) {
    this.progressBarService.availableProgress(false);
    const errorData = new Error(error.title, error.error.message);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = errorData;
    const dialogError = this.dialog.open(ErrorDialogComponent, dialogConfig);
    dialogError.afterClosed().subscribe(_ => {});
  }
}
