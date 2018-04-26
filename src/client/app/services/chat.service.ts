import {Injectable} from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {Error} from '../models/error';
import {ErrorDialogComponent} from '../errors/errordialog.component';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Message} from '../models/message';
import {getHeaders, HttpMethods} from '../utils/utils';
import {ProjectService} from './projects.service';
import {ProgressBarService} from './progressbar.service';

export class ChatThread {
  constructor(public id: string, public name: string, public lastMessages: Message[], public read: boolean) {}
}

@Injectable()
export class ChatService {
    // Rx Properties
    private threads = new BehaviorSubject(new Map<string, ChatThread>());
    threads$ = this.threads.asObservable();

    constructor(private http: HttpClient,
                private dialog: MatDialog,
                private progressBarService: ProgressBarService,
                private projectService: ProjectService) {
      // Everytime a project will be added, the service will retrieve it ChatThread
      // this.projectService.projects$.subscribe( projects =>
      //   this.getThreads(projects.map( value => value._id )).subscribe(threads => this.threads.next(threads))
      // );
    }

    /*
    Public methods
     */
    send(message: Message) {
      const req = new HttpRequest(HttpMethods.Post, 'chat/', {message: Message}, {headers: getHeaders()});
      return this.makeRequest(req)
        .map( res => res.json());
    }

    receivedOnProject(message: Message) { this.threads.value[message.receiver].lastMessages.push(message); }

    getMessages(id: string) {
      const req = new HttpRequest(HttpMethods.Get, 'chat/' + id, {headers: getHeaders()});
      return this.makeRequest(req)
        .map(res => res.json());
    }

    /*
    Private methods
     */
    private getThreads(projectIDs: string[]) {
      const req = new HttpRequest(HttpMethods.Post, 'chat/', {projectIDs: projectIDs}, {headers: getHeaders()});
      return this.makeRequest(req)
        .map( res => res.json());
    }

    private makeRequest(req: HttpRequest<any>): Observable<any> {
      this.progressBarService.availableProgress(true);
      return this.http.request(req)
        .catch( err => {
          this.throwError(err.json());
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
