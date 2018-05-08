import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ProjectService} from '../../services/projects.service';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(public auth: AuthService,
              public router: Router,
              private projectService: ProjectService) {}

  canActivate() {
    try {
      if (localStorage) {
        if (localStorage.getItem('token') !== null) {
          if (localStorage.getItem('token') !== undefined) {
            const decoded = jwt_decode(localStorage.getItem('token'));
            console.log(decoded.info.email);
            return this.projectService.isAdminOfCurrentProject(decoded.info.email);
          }
        }
      }
    } catch (error) {
      this.router.navigate(['dashboard']);
      return false;
    }
  }
}
