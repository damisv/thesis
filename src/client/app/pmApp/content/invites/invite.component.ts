import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ProjectService} from '../../../services/projects.service';
import {Subscription} from 'rxjs/Subscription';
import {InviteService} from '../../../services/invites.service';
import {Project} from '../../../models/project';
import {MyDataSource, MySimpleDataSource} from '../../../utils/customGenerics';

@Component({
  selector: 'app-pmapp-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss']
})
export class InvitesComponent implements OnInit {
  displayedColumns = ['no.', 'name', 'accept', 'reject'];

  dataSource: MySimpleDataSource<any> | null;
  invitesAvailable = false;
  constructor( private titleService: Title,
               private inviteService: InviteService,
               private projectService: ProjectService
  ) { inviteService.invites$.subscribe(invites => this.invitesAvailable = invites.length > 0); }

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

  ngOnInit() {
    this.dataSource = new MySimpleDataSource<any>(this.inviteService.invites$);
    this.titleService.setTitle('My Invites');
  }
}
