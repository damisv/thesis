import {Injectable} from '@angular/core';
import {ProjectService} from './projects.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {HttpMethods} from '../utils/utils';
import {Error} from '../models/error';
import {ErrorDialogComponent} from '../errors/errordialog.component';
import {Observable} from 'rxjs/Observable';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ProgressBarService} from './progressbar.service';
import {filter} from 'rxjs/operators';

export class TimelineLog {
  constructor(public name: string,
              public description: string,
              public date: Date) {}
}

@Injectable()
export class TimelineService {

  private timelineLogs = new BehaviorSubject<TimelineLog[]>([]);
  timelineLogs$ = this.timelineLogs.asObservable();

  constructor(private http: HttpClient,
              private projectService: ProjectService,
              private progressBarService: ProgressBarService) {
    projectService.project$
      .pipe(filter( value => value !== null))
      .distinctUntilChanged()
      .subscribe( project => this.getLogs(project._id));
  }

  // Public Methods
  /// Socket method
  receivedLog(log: TimelineLog) { this.timelineLogs.getValue().push(log); }

  // Private methods
  private getLogs(projectID: string) {
    const req = new HttpRequest(HttpMethods.Get, 'timeline/' + projectID);
    this.makeRequest(req)
      .subscribe(res => this.timelineLogs.next(res));
  }

  private makeRequest(req: HttpRequest<any>): Observable<any> {
    this.progressBarService.availableProgress(true);
    return this.http.request(req)
      .finally( () => this.progressBarService.availableProgress(false));
  }
}
