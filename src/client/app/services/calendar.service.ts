import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpRequest} from '@angular/common/http';
import { HttpMethods} from '../utils/utils';
import {CalendarEvent} from 'angular-calendar';
import {ProgressBarService} from './progressbar.service';
import {MyCalendarEvent} from '../models/calendarEvent';
import 'rxjs/add/operator/finally';

@Injectable()
export class CalendarService {
  // Static Properties
  private static base = 'api/calendar';

  // Rx Properties
  private myEvents = new BehaviorSubject<MyCalendarEvent[]>([]);
  myEvents$ = this.myEvents.asObservable();
  private projectEvents = new BehaviorSubject<MyCalendarEvent[]>([]);
  projectEvents$ = this.projectEvents.asObservable();

  // Initialization
  constructor(private http: HttpClient,
              private progressBarService: ProgressBarService) {}

  // Public Api Methods
  get() {
      const req = new HttpRequest(HttpMethods.Get, CalendarService.base);
      this.makeRequest(req)
        .subscribe(events => this.myEvents.next(events));
  }

  getFor(projectID: string) {
    const req = new HttpRequest(HttpMethods.Get, `${CalendarService.base}/` + projectID);
    this.makeRequest(req)
      .subscribe(events => this.projectEvents.next(events));
  }

  /// Creates an event and returns status
  create(event: MyCalendarEvent, projectID: any) {
    const body = projectID ? {projectID: projectID, event: event} : {event: event};
    const req = new HttpRequest(HttpMethods.Post, CalendarService.base, JSON.stringify(body));
    return this.makeRequest(req);
  }

  edit(event: CalendarEvent) {
    const req = new HttpRequest(HttpMethods.Put, CalendarService.base, JSON.stringify({event: event}));
    return this.makeRequest(req);
  }

  delete(event: MyCalendarEvent) {
    const req = new HttpRequest(HttpMethods.Delete, `${CalendarService.base}/` + event._id);
    return this.makeRequest(req);
  }

  // Private methods
  private makeRequest(req: HttpRequest<any>): Observable<any> {
    this.progressBarService.availableProgress(true);
    return this.http.request(req)
      .finally( () => this.progressBarService.availableProgress(false));
  }
}
