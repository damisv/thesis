import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import decode from 'jwt-decode';
import {AuthService} from '../../services/auth.service';
import {ProjectService} from '../../services/projects.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(public auth: AuthService,
              public router: Router,
              private projectService: ProjectService) {}

  canActivate() {
    // const token = localStorage.getItem('token');
    // // decode the token to get its payload
    // const tokenPayload = decode(token);
    if (!this.auth.isAuthenticated()) { // || this.projectService.isAdminOfCurrentProject(tokenPayload.email)) {
      this.router.navigate(['dashboard']);
      return false;
    }
    return true;
  }
}
