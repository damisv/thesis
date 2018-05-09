import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {Error} from '../models/error';
import {ErrorDialogComponent} from '../errors/errordialog.component';
import {Observable} from 'rxjs/Observable';
import {empty} from 'rxjs/observable/empty';
import {_throw} from 'rxjs/observable/throw';
import {catchError, map, tap} from 'rxjs/operators';
import {ProgressBarService} from './progressbar.service';
import {Router} from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog,
              private router: Router,
              private progressBarService: ProgressBarService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptor: --- ', req.url, req.body, req.method);
    this.progressBarService.availableProgress(true);
    let headers = {};
    if (localStorage.getItem('token') !== null) {
      if (localStorage.getItem('token') !== undefined) {
        headers = {'Content-Type': 'application/json', Authorization: localStorage.getItem('token')};
        const decoded = jwt_decode(localStorage.getItem('token'));
        if (decoded.exp < (new Date).getMilliseconds()) {
          this.router.navigate(['auth', 'signin']);
          return;
        }
      }
    } else { headers = {'Content-Type': 'application/json'}; }
    const cloneRequest =  req.clone({ setHeaders: headers});
    return next.handle(cloneRequest)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff
          }
        }),
        catchError((err: HttpErrorResponse) => {
          if ((err.status === 498)) {
            this.router.navigate(['/auth/signin']);
            this.throwError(err.error);
            return empty();
          }
          this.throwError(err.error);
          return _throw(err);
        })).finally(() => this.progressBarService.availableProgress(false));
  }

  private throwError(error: Error) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = error;
    const dialogError = this.dialog.open(ErrorDialogComponent, dialogConfig);
    dialogError.afterClosed().subscribe();
  }
}
