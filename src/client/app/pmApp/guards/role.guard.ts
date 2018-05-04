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
    // checks if null or undefined
    if (localStorage.getItem('token') !== null) {
      this.router.navigate(['app/project/dashboard']);
      return false;
    }
    try {
      const decoded = jwt_decode(localStorage.getItem('token'));
      return this.projectService.isAdminOfCurrentProject(decoded.info.email);
    } catch (error) {
      this.router.navigate(['dashboard']);
      return false;
    }
  }
}
