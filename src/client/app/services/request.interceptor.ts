import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse, HttpHeaders} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {Error} from '../models/error';
import {ErrorDialogComponent} from '../errors/errordialog.component';
import {Observable} from 'rxjs/Observable';
import {empty} from 'rxjs/observable/empty';
import {_throw} from 'rxjs/observable/throw';
import {catchError, map, tap} from 'rxjs/operators';
import {ProgressBarService} from './progressbar.service';
@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog,
              private progressBarService: ProgressBarService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptor: --- ', req.url, req.body, req.method);
    this.progressBarService.availableProgress(true);
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    if (localStorage.getItem('token') !== null) {
      httpHeaders.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    }
    const cloneRequest = req.clone({ headers: httpHeaders });
    return next.handle(cloneRequest)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff
          }
        }),
        catchError((err: HttpErrorResponse) => {
          if ((err.status === 400) || (err.status === 401)) {
            return empty();
          }
          this.throwError(err.error);
          return _throw(err);
        })).finally(() => this.progressBarService.availableProgress(false));
  }

  // Error
  private throwError(error) {
    const errorData = new Error(error.title, error.error.message);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = errorData;
    const dialogError = this.dialog.open(ErrorDialogComponent, dialogConfig);
    dialogError.afterClosed().subscribe();
  }
}
