import {Injectable} from '@angular/core';
import 'rxjs/add/operator/finally';
import { Observable } from 'rxjs/Observable';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Message} from '../models/message';
import {HttpMethods} from '../utils/utils';
import {ProjectService} from './projects.service';
import {ProgressBarService} from './progressbar.service';

export class ChatThread {
  constructor(public id: string, public name: string,
              public lastMessages: Message[], public read: boolean) {}
}

@Injectable()
export class ChatService {
  // Static Properties
  private static base = 'api/chat';

  // Rx Properties
  private threads = new BehaviorSubject(new Map<string, ChatThread>());
  threads$ = this.threads.asObservable();

  constructor(private http: HttpClient,
              private progressBarService: ProgressBarService,
              private projectService: ProjectService) {
    // Everytime a project will be added, the service will retrieve it ChatThread
    // this.projectService.projects$.subscribe( projects =>
    //   this.getThreads(projects.map( value => value._id )).subscribe(threads => this.threads.next(threads))
    // );
  }

  // Public methods
  send(message: Message) {
    const req = new HttpRequest(HttpMethods.Post, ChatService.base, JSON.stringify({message: Message}));
    return this.makeRequest(req);
  }

  receivedOnProject(message: Message) { this.threads.value[message.receiver].lastMessages.push(message); }

  getMessages(id: string) {
    const req = new HttpRequest(HttpMethods.Get, `${ChatService.base}/` + id);
    return this.makeRequest(req);
  }

  // Private methods
  private getThreads(projectIDs: string[]) {
    const req = new HttpRequest(HttpMethods.Post, `${ChatService.base}/threads`, JSON.stringify({projectIDs: projectIDs}));
    return this.makeRequest(req);
  }

  private makeRequest(req: HttpRequest<any>): Observable<any> {
    this.progressBarService.availableProgress(true);
    return this.http.request(req)
      .finally( () => this.progressBarService.availableProgress(false));
  }
}
