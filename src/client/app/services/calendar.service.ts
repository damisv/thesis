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
  constructor(private http: HttpClient) {}

  // Public Api Methods
  get() {
    this.http.get<MyCalendarEvent[]>(CalendarService.base)
      .subscribe(events => this.myEvents.next(events));
  }

  getFor(projectID: string) {
    this.http.get<MyCalendarEvent[]>(`${CalendarService.base}/` + projectID)
      .subscribe(events => this.projectEvents.next(events));
  }

  /// Creates an event and returns id
  create(event: MyCalendarEvent, projectID: any): Observable<any> {
    return this.http.post(CalendarService.base, projectID ? {projectID: projectID, event: event} : {event: event});
  }

  edit(event: CalendarEvent): Observable<any> {
    return this.http.put(CalendarService.base, {event: event});
  }

  delete(event: MyCalendarEvent): Observable<any> {
    return this.http.delete(`${CalendarService.base}/` + event._id);
  }
}
