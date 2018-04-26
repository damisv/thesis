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

  // Current Project Task, Issues Observables
  private tasks = new BehaviorSubject<Task[]>([]);
  private issues = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasks.asObservable();
  issues$ = this.issues.asObservable();

  constructor(private http: HttpClient,
              private progressBarService: ProgressBarService,
              private dialog: MatDialog) {}

  // Get All User Task by type (task, issues, feedback)
  get(type: TaskType) {
    const req = new HttpRequest(HttpMethods.Get, TaskType[type], {headers: getHeaders()});
    return this.makeRequest(req)
      .map(res => res.json());
  }

  // Get All Project Task by type (task, issues, feedback)
  getFor(projectID: string, type: TaskType) {
      const req = new HttpRequest(HttpMethods.Get, TaskType[type] + '/project/' + projectID, {headers: getHeaders()});
      return this.makeRequest(req)
        .map(res => res.json())
        .subscribe( values => this.addValues(values, type));
  }

  create(task: Task) {
    // if (typeof task.date_start !== 'undefined') { task.date_start = task.date_start.toISOString(); }
    // if (typeof task.date_end !== 'undefined') { task.date_end = task.date_end.toISOString(); }
    const req = new HttpRequest(HttpMethods.Post, TaskType[task.type] + '/create', {task: task}, {headers: getHeaders()});
    return this.makeRequest(req)
      .map(res => res.json());
      // .do( _ => this.addValues(task, task.type));
  }

  complete(task: Task) {
    const req = new HttpRequest(HttpMethods.Patch, TaskType[task.type] + '/complete/' + task._id, {headers: getHeaders()});
    return this.makeRequest(req)
      .map(res => res.json());
  }

  // When a task arrives through socket, this method should be called.
  add(task: Task) {
    if (localStorage.hasOwnProperty('projectID')) {
       if (task.project_id === localStorage.getItem('projectID')) { this.addValues(task, task.type); }
    }
  }

  // Add Value to Observables based on type
  private addValues(values: any, type: TaskType) {
    switch (type) {
      case TaskType.task:
        values instanceof Array ? this.tasks.next(values) : this.tasks.getValue().push(values);
        break;
      case TaskType.issue:
        values instanceof Array ? this.issues.next(values) : this.issues.getValue().push(values);
        break;
      case TaskType.feedback:
        //  values instanceof Array ? this.feedbacks.next(values) : this.feedbacks.getValue().push(values);
        break;
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
