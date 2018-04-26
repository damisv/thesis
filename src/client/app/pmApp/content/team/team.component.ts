import {Component} from '@angular/core';
import {ProjectService} from '../../../services/projects.service';
import {Subscription} from 'rxjs/Subscription';
import {Project} from '../../../models/project';
import {InviteService} from '../../../services/invites.service';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-pmapp-project-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent {
  displayedColumns = ['no.', 'name', 'position', 'remove'];

  project: Project;
  projectSubscription: Subscription = this.projectService.project$.subscribe(project => this.project = project);
  userEmail: string;
  userSubscription: Subscription = this.userService.user$.subscribe( user => this.userEmail = user.email);

  constructor(private userService: UserService,
              private projectService: ProjectService,
              private inviteService: InviteService) {}

  removeMember(email: string, index: number) {
    this.projectService.removeMember(email, this.project._id)
      .subscribe(res => this.projectService.remove(index));
  }

  addInvite(team: string[]) {
    // this.inviteService.invite(member, this.project._id)
    //   .subscribe(
    //     _ => {},
    //     err => {}// this.notificationService.create("error"," Error Invite failed","Error! Unable to send invite to "+email,"error");
    //   );
  }
}
