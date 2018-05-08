import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import { Observable } from 'rxjs/Observable';
import {Project} from '../models/project';
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
    console.log('EMAIL', email);
    console.log(this.project.value.team);
    return this.project.value.team.filter(member => member.email === email && member.position === 0).length > 0;
  }

  initProject(projects) {
    if (localStorage.hasOwnProperty('projectID')) {
      for (const project of projects) {
        if (project._id === localStorage.getItem('projectID')) {
          this.giveProject(project);
          break;
        }
      }
    }
  }

  getProject(id): Observable<Project> {
      return this.http.get<Project>(`${ProjectService.base}/` + id);
  }

  giveProject(project: Project) {
      localStorage.setItem('projectID', project._id);
      this.project.next(project);
  }

  addToProjects(project: Project) {
    const temp = this.projects.value;
    temp.push(project);
    this.projects.next(temp);
  }

  edit(project): Observable<any> {
    return this.http.put(`${ProjectService.base}/` + project._id, {project: project});
  }

  create(project: Project, invites: string[]): Observable<any> {
      return this.http.post(ProjectService.base, {project: project, invites: invites});
  }

  delete(project: Project): Observable<any> {
    return this.http.delete(`${ProjectService.base}/` + project._id);
  }

  // Remove Member Of Project Team
  removeMember(email: string, projectID: string): Observable<any> {
    return this.http.patch(`${ProjectService.base}/` + projectID, {email : email});
  }

  remove(index: number) {
    if (this.project.value !== null) {
      this.project.value.team.splice(index, 1);
      const tempProject = this.project.value;
      const tempIndex = this.projects.value.findIndex(value => value._id === tempProject._id);
      this.projects.value[tempIndex] = tempProject;
    }
  }

  filterName(name): Observable<{name: string, id: string}[]> {
    return this.http.get<{name: string, id: string}[]>(`${ProjectService.base}/search/` + name);
  }

  getProjects() {
    this.http.get<Project[]>(ProjectService.base)
      .subscribe( projects => this.giveProjects(projects));
  }
}
