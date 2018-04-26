import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import { Observable } from 'rxjs/Observable';
import {Project} from '../models/project';
import {ProgressBarService} from './progressbar.service';
import {getHeaders, HttpMethods} from '../utils/utils';
import {ErrorDialogComponent} from '../errors/errordialog.component';
import {Error} from '../models/error';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TaskService} from './task.service';
import {TaskType} from '../models/task';
import {filter} from 'rxjs/operators';

@Injectable()
export class ProjectService {

  private project = new BehaviorSubject<Project>(null);
  project$ = this.project.asObservable()
    .pipe(filter(value => value !== null))
    .distinctUntilChanged();

  private projects = new BehaviorSubject<Project[]>([]);
  projects$ = this.projects.asObservable();

  constructor(private http: HttpClient,
              private progressBarService: ProgressBarService,
              private taskService: TaskService,
              private dialog: MatDialog) {
    this.project$.subscribe(
      project => {
        this.taskService.getFor(project._id, TaskType.task);
        this.taskService.getFor(project._id, TaskType.issue);
      }
    );
  }

  giveProjects(projects: Project[]) {
      this.initProject(projects);
      this.projects.next(projects);
  }

  initProject(projects) {
    if (localStorage.hasOwnProperty('projectID')) {
      for (const project of projects) {
        /*this.chatService.getProjectMessages(project._id).subscribe(res=>{
            this.chatService.addMessages(res.messages);
        });*/
        if (project._id === localStorage.getItem('projectID')) {
          this.giveProject(project);
          break;
        }
      }
    }
  }

  getProject(id) {
      const req = new HttpRequest(HttpMethods.Get, 'project/search/' + id, {headers: getHeaders()});
      return this.makeRequest(req)
        .map(res => res.json());
  }

  giveProject(project: Project) {
      localStorage.setItem('projectID', project._id);
      this.project.next(project);
  }

  addToProjects(project: Project) { this.projects.getValue().push(project); }

  edit(project) {
    const req = new HttpRequest(HttpMethods.Put, 'project/' + project._id, {headers: getHeaders()});
    return this.makeRequest(req)
      .map(res => res.json());
  }

  create(project: Project, invites: string[]) {
      const req = new HttpRequest(HttpMethods.Post, 'project/create', {project: project, invites: invites}, {headers: getHeaders()});
      return this.makeRequest(req)
        .map(res => res.json());
  }

  delete(project: Project) {
    const req = new HttpRequest(HttpMethods.Delete, 'project/' + project._id, {headers: getHeaders()});
    return this.makeRequest(req)
      .map(res => res.json());
  }

  // Remove Member Of Project Team
  removeMember(email: string, projectID: string) {
    const req = new HttpRequest(HttpMethods.Patch, 'project.' + projectID, {headers: getHeaders()});
    return this.makeRequest(req)
      .map(res => res.json());
  }

  remove(index: number) {
    if (this.project.getValue() !== null) {
      this.project.getValue().team.splice(index, 1);
      const tempProject = this.project.getValue();
      const tempIndex = this.projects.getValue().findIndex(value => value._id === tempProject._id);
      this.projects.getValue()[tempIndex] = tempProject;
    }
  }

  filterName(name) {
    const req = new HttpRequest(HttpMethods.Get, 'project/search/' + name, {headers: getHeaders()});
    return this.makeRequest(req)
      .map(res => res.json());
  }

  getProjects() {
    const req = new HttpRequest(HttpMethods.Get, 'project', {headers: getHeaders()});
    this.makeRequest(req)
      .map(res => res.json())
      .subscribe(
        res => this.giveProjects(res.projects),
        err => this.throwError(err)
      );
  }

  private makeRequest(req: HttpRequest<any>): Observable<any> {
    this.progressBarService.availableProgress(true);
    return this.http.request(req)
      .catch( err => {
        this.throwError(err);
        return Observable.throw(err);
      })
      .finally( () => this.progressBarService.availableProgress(false));
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
