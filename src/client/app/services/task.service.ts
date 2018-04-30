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
import {HttpMethods} from '../utils/utils';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class TaskService {
  // Static Properties
  private static base = 'api/assignment';
  // Rx Properties
  // Current task for editing or viewing
  private task = new Subject<Task>();
  task$ = this.task.asObservable();

  // Current Project Assignments Observables
  private assignments = new BehaviorSubject<Task[]>([]);
  assignments$ = this.assignments.asObservable();

  constructor(private http: HttpClient) {}

  // Get All User Task by type (task, issues, feedback)
  get(type: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${TaskService.base}/` + type);
  }

  // Get All Project Assignments
  getFor(projectID: string) {
    this.http.get<Task[]>(`${TaskService.base}/project/` + projectID)
      .subscribe( values => this.assignments.next(values));
  }

  // Get Task by ID
  getBy(id: string): Observable<Task> {
    return this.http.get<Task>(`${TaskService.base}/` + id);
  }

  create(task: Task): Observable<any> {
    // if (typeof task.date_start !== 'undefined') { task.date_start = task.date_start.toISOString(); }
    // if (typeof task.date_end !== 'undefined') { task.date_end = task.date_end.toISOString(); }
    return this.http.post(TaskService.base, {task: task});
  }

  edit(task: Task): Observable<any> {
    return this.http.put(`${TaskService.base}/` + task._id, {task: task});
  }

  changeStatus(task: Task): Observable<any> {
    return this.http.patch(`${TaskService.base}/` + task._id, {task: task});
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
}
