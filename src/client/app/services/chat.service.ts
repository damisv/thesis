import {Injectable} from '@angular/core';
import 'rxjs/add/operator/finally';
import { Observable } from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Message} from '../models';
import {ProjectService} from './projects.service';
import {SocketService} from './socket.service';

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
              private projectService: ProjectService,
              private socketService: SocketService) {
    // Everytime a project will be added, the service will retrieve it ChatThread
    this.projectService.projects$.subscribe( projects =>
      this.getThreads(projects.map( value => ({id: value._id, name: value.name})))
        .map(threads => {
          const temp = Object.keys(threads);
          const data = new Map<string, ChatThread>();
          temp.forEach(value => data.set(value, threads[value]));
          return data;
        })
        .subscribe(res => this.threads.next(res))
    );
    socketService.onProjectMessage().subscribe(message => this.receivedOnProject(message)); // receives new messages
  }

  // Public methods
  send(message: Message): Observable<any> {
    return this.http.post(ChatService.base, {message: message});
  }

  private receivedOnProject(message: Message) {
    const temp = this.threads.value;
    const tempThread = temp.get(message.receiver);
    tempThread.lastMessages.push(message);
    temp.set(message.receiver, tempThread);
    this.threads.next(temp);
  }

  getMessages(id: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${ChatService.base}/` + id);
  }

  // Private methods
  private getThreads(projects: any[]): Observable<Map<string, ChatThread>> {
    return this.http.post<Map<string, ChatThread>>(`${ChatService.base}/threads`, {projects: projects});
  }
}
