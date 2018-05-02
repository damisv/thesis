import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import { Observable } from 'rxjs/Observable';
import {Task} from '../models/task';
import {Subject} from 'rxjs/Subject';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class TaskService {
  // Static Properties
  private static base = 'api/assignments';
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
    return this.http.post(TaskService.base, {task: task});
  }

  edit(task: Task): Observable<any> {
    return this.http.put(TaskService.base, {task: task});
  }

  changeStatus(task: Task): Observable<any> {
    return this.http.patch(TaskService.base, {task: task});
  }

  // Changes the status on this assignments array
  changeStatusOf(id: string, status: boolean) {
    const temp = this.assignments.value;
    const index = temp.findIndex(value => value._id === id);
    temp[index].completed = status;
    this.assignments.next(temp);
  }

  // When a task arrives through socket, this method should be called.
  add(task: Task) {
    if (localStorage.hasOwnProperty('projectID')) {
       if (task.project_id === localStorage.getItem('projectID')) {
         const temp = this.assignments.value;
         temp.push(task);
         this.assignments.next(temp);
       }
    }
  }
}
