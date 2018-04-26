import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ProgressBarService} from './progressbar.service';
import {ErrorDialogComponent} from '../errors/errordialog.component';
import {Account} from '../models/account';
import {Error} from '../models/error';
import {HttpMethods} from '../utils/utils';

@Injectable()
export class AuthService {
  // Static properties
  private static  signInUrl = 'api/signin';
  private static signUpUrl = 'api/signup';
  // Properties
  selectedOption;
  // Initializations
  constructor(private http: HttpClient,
              private progressBarService: ProgressBarService,
              private dialog: MatDialog) {
  }
  // Public methods
  signUp(account: Account): Promise<any> {
    const body = JSON.stringify({account: account});
    const req = new HttpRequest(HttpMethods.Post, AuthService.signUpUrl, { params: body });
    return this.makeRequest(req);
  }
  signIn(account: Account): Promise<any> {
    const body = JSON.stringify({account: account});
    const req = new HttpRequest(HttpMethods.Post, AuthService.signInUrl, { params: body});
    return this.makeRequest(req);
  }
  // Private methods
  private makeRequest(req: HttpRequest<any>): Promise<any> {
    this.progressBarService.availableProgress(true);
    return new Promise((fullfill, reject) => {
      this.http.request(req)
        .toPromise()
        .then(res => {
            fullfill(res);
            this.progressBarService.availableProgress(false);
          }
        )
        .catch((err) => {
          this.throwError(err);
          reject(err);
        });
    });
  }
  // Error
  private throwError(error) {
    this.progressBarService.availableProgress(false);
    const errorData = new Error(error.title, error.error.message);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = errorData;
    const dialogError = this.dialog.open(ErrorDialogComponent, dialogConfig);
    dialogError.afterClosed().subscribe(result => this.selectedOption = result );
  }
}
