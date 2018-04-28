import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import { Observable } from 'rxjs/Observable';
import {Project, ProjectPosition} from '../models/project';
import {ProgressBarService} from './progressbar.service';
import {HttpMethods} from '../utils/utils';
import {MatDialog} from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TaskService} from './task.service';
import {filter} from 'rxjs/operators';
import {CalendarService} from './calendar.service';

@Injectable()
export class ProjectService {
  // Static Properties
  private static base = 'api/project';

  // Rx Properties
  private project = new BehaviorSubject<Project>(null);
  project$ = this.project.asObservable()
    .pipe(filter(value => value !== null))
    .distinctUntilChanged();

  private projects = new BehaviorSubject<Project[]>([]);
  projects$ = this.projects.asObservable();

  constructor(private http: HttpClient,
              private progressBarService: ProgressBarService,
              private taskService: TaskService,
              private calendarService: CalendarService,
              private dialog: MatDialog) {
    this.project$.subscribe(project => {
      this.taskService.getFor(project._id);
      this.calendarService.getFor(project._id);
    });
  }

  giveProjects(projects: Project[]) {
      this.initProject(projects);
      this.projects.next(projects);
  }

  // This method is used for RoleGuard
  isAdminOfCurrentProject(email: string) {
    return this.project.getValue().team.find(member => member.email === email && member.position === ProjectPosition.manager) === undefined;
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
      const req = new HttpRequest(HttpMethods.Get, `${ProjectService.base}/` + id);
      return this.makeRequest(req);
  }

  giveProject(project: Project) {
      localStorage.setItem('projectID', project._id);
      this.project.next(project);
  }

  addToProjects(project: Project) { this.projects.getValue().push(project); }

  edit(project) {
    const req = new HttpRequest(HttpMethods.Put, `${ProjectService.base}/` + project._id, JSON.stringify({project: project}));
    return this.makeRequest(req);
  }

  create(project: Project, invites: string[]) {
      const req = new HttpRequest(HttpMethods.Post, ProjectService.base, JSON.stringify({project: project, invites: invites}));
      return this.makeRequest(req);
  }

  delete(project: Project) {
    const req = new HttpRequest(HttpMethods.Delete, `${ProjectService.base}/` + project._id);
    return this.makeRequest(req);
  }

  // Remove Member Of Project Team
  removeMember(email: string, projectID: string) {
    const req = new HttpRequest(HttpMethods.Patch, `${ProjectService.base}/` + projectID, JSON.stringify({email : email}));
    return this.makeRequest(req);
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
    const req = new HttpRequest(HttpMethods.Get, `${ProjectService.base}/search/` + name);
    return this.makeRequest(req);
  }

  getProjects() {
    const req = new HttpRequest(HttpMethods.Get, ProjectService.base);
    this.makeRequest(req)
      .subscribe( res => this.giveProjects(res.projects));
  }

  private makeRequest(req: HttpRequest<any>): Observable<any> {
    this.progressBarService.availableProgress(true);
    return this.http.request(req)
      .finally( () => this.progressBarService.availableProgress(false));
  }
}
