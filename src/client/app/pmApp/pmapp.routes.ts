import {Routes} from '@angular/router';

import {PMAppComponent} from './pmapp.component';
import {DashboardComponent} from './content/dashboard/dashboard.component';
import {ProjectsComponent} from './content/projects/projects.component';
import {NotFoundErrorComponent} from './content/errors/notfound.component';
import {InvitesComponent} from './content/invites/invite.component';
import {ProfileComponent} from './content/user/profile.component';
import {OthersProfileComponent} from './content/user/others_profile.component';
import {CalendarComponent} from './content/calendar/calendar.component';
import {ChatComponent} from './content/chat/chat.component';
import {ProjectDashboardComponent} from './content/dashboard/project_dashboard.component';
import {ProjectSettingsComponent} from './content/settings/project_settings.component';
import {UserSidebarComponent} from './content/sidebar/menu/usersidebar.component';
import {NotificationsComponent} from './content/sidebar/notifications/notifications.component';
import {ProjectSidebarComponent} from './content/sidebar/menu/projectsidebar.component';
import {TimelineComponent} from './content/timeline/timeline.component';
import {TeamComponent} from './content/team/team.component';
import {MyAssignmentsComponent} from './content/assignments/myassignments.component';
import {ProjectAssignmentsComponent} from './content/assignments/projectassignments.component';
import {ProjectAssignmentComponent} from './content/assignments/projectassignment.component';

export const PMAPP_ROUTES: Routes = [
  {path: '', component: PMAppComponent, children: [
      {path: '', redirectTo: 'dashboard'},
      {path: '', component: UserSidebarComponent, outlet: 'sidebar'},
      {path: '', component: NotificationsComponent, outlet: 'notifications'},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'myprojects', component: ProjectsComponent},
      {path: 'mytasks', component: MyAssignmentsComponent, data: {type: 'task'}},
      {path: 'myissues', component: MyAssignmentsComponent, data: {type: 'issue'}},
      {path: 'calendar', component: CalendarComponent},
      {path: 'chat', component: ChatComponent},
      {path: 'invites', component: InvitesComponent},
      {path: 'profile', component: ProfileComponent},
      {path: 'profile/:id', component: OthersProfileComponent},
      { path: 'project', children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
          { path: '', component: ProjectSidebarComponent, outlet: 'projectSidebar'},
          { path: 'dashboard', component: ProjectDashboardComponent},
          { path: 'assignments', component: ProjectAssignmentsComponent, children: [
              { path: '', redirectTo: 'assignments', pathMatch: 'full'},
              { path: 'assignments', component: ProjectAssignmentComponent, outlet: 'assignments', data: {type: 'assignments'}},
              { path: 'tasks', component: ProjectAssignmentComponent, outlet: 'assignments', data: {type: 'task'}},
              { path: 'issues', component: ProjectAssignmentComponent, outlet: 'assignments', data: {type: 'issue'}}
            ]},
          { path: 'team', component: TeamComponent},
          { path: 'timeline', component: TimelineComponent},
          { path: 'chat', component: ChatComponent},
          { path: 'settings', component: ProjectSettingsComponent},
          { path: '**', redirectTo: '404', pathMatch: 'full'},
          { path: '404', component: NotFoundErrorComponent}
        ]},
      { path: '**', redirectTo: '404', pathMatch: 'full'},
      { path: '404', component: NotFoundErrorComponent}
    ]}
];
