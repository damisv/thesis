import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Option, SidebarMenuService, userSideNav} from './sidebarmenu.service';

@Component({
  selector: 'app-pmapp-sidebar',
  template: `<mat-nav-list *ngIf="userMenuAvailable">
      <mat-list-item *ngFor="let option of menu" [routerLink]="[option.path]" routerLinkActive="active">
          <mat-icon mat-list-icon>{{option.icon}}</mat-icon>
          <h3 mat-line>{{option.name}}</h3>
          <p mat-line class="nav-description"><span>{{option.description}}</span></p>
      </mat-list-item>
    </mat-nav-list>`,
  styleUrls: ['./sidebar.component.scss']
})
export class UserSidebarComponent implements OnDestroy {
  userMenuAvailable = true;
  menu: Option[] = userSideNav;

  sidebarSubscription: Subscription = this.sidebarService.status$.subscribe( status => this.userMenuAvailable = status);

  constructor(private sidebarService: SidebarMenuService) {}

  ngOnDestroy() { this.sidebarSubscription.unsubscribe(); }
}
