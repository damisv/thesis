import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {AuthService, tokenExists} from '../../services/auth.service';
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
    if (!tokenExists) { // || this.projectService.isAdminOfCurrentProject(tokenPayload.email)) {
      this.router.navigate(['dashboard']);
      return false;
    }
    return true;
  }
}
