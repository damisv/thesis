import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {getHeaders, HttpMethods} from '../utils/utils';
import {CalendarEvent} from 'angular-calendar';
import {ErrorDialogComponent} from '../errors/errordialog.component';
import {Error} from '../models/error';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ProgressBarService} from './progressbar.service';
import {MyCalendarEvent} from '../models/calendarEvent';

@Injectable()
export class CalendarService {

    private myEvents = new BehaviorSubject<MyCalendarEvent[]>([]);
    myEvents$ = this.myEvents.asObservable();

    private projectEvents = new BehaviorSubject<MyCalendarEvent[]>([]);
    projectEvents$ = this.projectEvents.asObservable();

    constructor(private http: HttpClient,
                private progressBarService: ProgressBarService,
                private dialog: MatDialog) {}

    get() {
        const req = new HttpRequest(HttpMethods.Get, 'calendar', {headers: getHeaders()});
        this.makeRequest(req)
          .map(res => res.json())
          .subscribe(events => this.myEvents.next(events));
    }

    getFor(projectID: string) {
      const req = new HttpRequest(HttpMethods.Get, 'calendar/' + projectID, {headers: getHeaders()});
      this.makeRequest(req)
        .map(res => res.json())
        .subscribe(events => this.projectEvents.next(events));
    }

    // Creates an event and returns status
    create(event: CalendarEvent, projectID: any) {
      const req = new HttpRequest(HttpMethods.Post, 'calendar',
        projectID ? {projectID: projectID, event: event} : {event: event},
        {headers: getHeaders()});
      return this.makeRequest(req)
        .map(res => res.json());
    }

    edit(event: CalendarEvent) {
      const req = new HttpRequest(HttpMethods.Put, 'calendar', {event: event}, {headers: getHeaders()});
      return this.makeRequest(req)
        .map(res => res.json());
    }

    delete(event: MyCalendarEvent) {
      const req = new HttpRequest(HttpMethods.Delete, 'calendar/' + event._id, {headers: getHeaders()});
      return this.makeRequest(req)
        .map(res => res.json());
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
