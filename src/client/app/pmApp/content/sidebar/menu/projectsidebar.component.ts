import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Option, projectSideNav, SidebarMenuService} from './sidebarmenu.service';

@Component({
  selector: 'app-pmapp-projectsidebar',
  template: `<mat-nav-list>
      <mat-list-item *ngFor="let option of menu" [routerLink]="[option.path]" routerLinkActive="active">
        <mat-icon mat-list-icon>{{option.icon}}</mat-icon>
        <h3 mat-line>{{option.name}}</h3>
        <p mat-line class="nav-description"><span>{{option.description}}</span></p>
      </mat-list-item>
  </mat-nav-list>`,
  styleUrls: ['./sidebar.component.scss']
})
export class ProjectSidebarComponent implements OnInit, OnDestroy {

  userMenuAvailable = true;
  menu: Option[] = projectSideNav;

  sidebarSubscription: Subscription = this.sidebarService.status$.subscribe( status => this.userMenuAvailable = status);

  constructor(private sidebarService: SidebarMenuService) {}

  ngOnInit() { this.sidebarService.changeStatus(); }

  ngOnDestroy() {
    this.sidebarService.changeStatus();
    this.sidebarSubscription.unsubscribe();
  }
}
