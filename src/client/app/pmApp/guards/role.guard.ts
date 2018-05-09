import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {AuthService, ProjectService, SnackbarService} from '../../services';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(public auth: AuthService,
              public router: Router,
              private projectService: ProjectService,
              private snackBar: SnackbarService) {}

  canActivate() {
    try {
      if (localStorage) {
        if (localStorage.getItem('token') !== null) {
          if (localStorage.getItem('token') !== undefined) {
            const decoded = jwt_decode(localStorage.getItem('token'));
            if (!this.projectService.isAdminOfCurrentProject(decoded.info.email)) {
              this.snackBar.show('You don\'t have the required permissions to access this.');
              return false;
            }
            return true;
          }
        }
      }
    } catch (error) {
      this.router.navigate(['dashboard']);
      return false;
    }
  }
}
