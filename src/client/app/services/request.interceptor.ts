import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/empty';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {Error} from '../models/error';
import {ErrorDialogComponent} from '../errors/errordialog.component';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptor: --- ', req.url, req.body, req.method);
    let temp = {};
    if (localStorage.getItem('token') !== null) {
      temp = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      };
    } else {
      temp = { 'Content-Type': 'application/json' };
    }
    req = req.clone({
      setHeaders: temp
    });
    return next.handle(req)
      .catch((err: HttpErrorResponse) => {
      this.throwError(err.error);
      return Observable.empty<HttpEvent<any>>();
    }) as any;
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
