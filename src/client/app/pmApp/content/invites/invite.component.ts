import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ProjectService} from '../../../services/projects.service';
import {Subscription} from 'rxjs/Subscription';
import {InviteService} from '../../../services/invites.service';
import {User} from '../../../models/user';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-pmapp-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss']
})
export class InvitesComponent implements OnInit, OnDestroy {
  displayedColumns = ['no.', 'name', 'position', 'accept', 'reject'];

  invites: object[] = [];
  invitesSubscription: Subscription = this.inviteService.invites$.subscribe(res => this.invites = res);
  constructor( private titleService: Title,
               private inviteService: InviteService,
               private projectService: ProjectService
               // private notificationService:NotificationService)
  ) {}

  // Accepts an invite. On success returns the project in cause and removes from array the entry.
  acceptInvite(projectID: string, index: number) {
    this.inviteService.acceptInvite(projectID)
      .subscribe( res => {
        this.inviteService.removeInvite(index);
        this.projectService.addToProjects(res);
      });
  }

  // Rejects an invite. On success removes from array the entry.
  rejectInvite(projectID: string, index: number) {
    this.inviteService.rejectInvite(projectID)
      .subscribe( _ => this.inviteService.removeInvite(index));
  }

  ngOnInit() { this.titleService.setTitle('My Invites'); }
  ngOnDestroy() { this.invitesSubscription.unsubscribe(); }
}
