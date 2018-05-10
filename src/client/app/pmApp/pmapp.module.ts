import {NgModule} from '@angular/core';

import {MaterialModule} from '../material.module';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {PMAppComponent} from './pmapp.component';
import {PMAppRoutingModule} from './pmapp-routing.module';

import {DashboardComponent} from './content/dashboard/dashboard.component';
import {ProjectsComponent} from './content/projects/projects.component';
import {NotFoundErrorComponent} from './content/errors/notfound.component';
import {CreateprojectComponent} from './content/projects/createproject.component';
import {InvitesComponent} from './content/invites/invite.component';
import {ProfileComponent} from './content/user/profile.component';
import {OthersProfileComponent} from './content/user/others_profile.component';
import {CalendarComponent} from './content/calendar/calendar.component';
import {ChatComponent} from './content/chat/chat.component';
import {TruncateModule} from '@yellowspot/ng-truncate';
import {ProjectDashboardComponent} from './content/dashboard/project_dashboard.component';
import {ProjectSettingsComponent} from './content/settings/project_settings.component';
import {UserSidebarComponent} from './content/sidebar/menu/usersidebar.component';
import {ProjectSidebarComponent} from './content/sidebar/menu/projectsidebar.component';
import {NotificationsComponent} from './content/sidebar/notifications/notifications.component';
import {SidebarMenuService} from './content/sidebar/menu/sidebarmenu.service';
import {MglTimelineModule} from 'angular-mgl-timeline';
import {TimelineComponent} from './content/timeline/timeline.component';
import {MyParticlesModule} from '../particles/myparticles.module';
import {TeamComponent} from './content/team/team.component';
import {MyAssignmentsComponent} from './content/assignments/myassignments.component';
import {ProjectAssignmentsComponent} from './content/assignments/project/projectassignments.component';
import {ProjectAssignmentComponent} from './content/assignments/project/classic/projectassignment.component';
import {AgileComponent} from './content/assignments/project/agile/agile.component';
import {AgileBoardComponent} from './content/assignments/project/agileBoard/agileBoard.component';
import {CreateAssignmentComponent} from './content/assignments/project/createassignment.component';
import {ViewAssignmentComponent} from './content/assignments/project/viewassignment.component';
import {CalendarModule} from 'angular-calendar';
import {ContextMenuModule} from 'ngx-contextmenu';
import {CalendarEventDialogComponent} from './content/calendar/calendareventdialog.component';
import {
  CalendarService, NotificationService, SnackbarService, InviteService,
  TimelineService, ChatService, UserService, ProjectService, TaskService
} from '../services';
import {SocketService} from '../services/socket.service';
import {RoleGuard} from './guards/role.guard';
import {PushNotificationModule} from 'ng-push-notification';
import {GanttComponent} from './content/gantt/gantt.component';

@NgModule({
  declarations: [
    PMAppComponent,
    DashboardComponent,
    ProjectDashboardComponent,
    ProjectsComponent,
    UserSidebarComponent,
    ProjectSidebarComponent,
    CreateprojectComponent,
    InvitesComponent,
    TeamComponent,
    ProfileComponent,
    OthersProfileComponent,
    MyAssignmentsComponent,
    CreateAssignmentComponent,
    ViewAssignmentComponent,
    GanttComponent,
    ProjectAssignmentsComponent,
    ProjectAssignmentComponent,
    AgileComponent,
    AgileBoardComponent,
    ChatComponent,
    CalendarComponent,
    CalendarEventDialogComponent,
    ProjectSettingsComponent,
    TimelineComponent,
    NotificationsComponent,
    NotFoundErrorComponent
  ],
  imports: [
    CommonModule,
    PMAppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MyParticlesModule,
    TruncateModule,
    MglTimelineModule,
    CalendarModule.forRoot(),
    ContextMenuModule.forRoot({ autoFocus: true }),
    PushNotificationModule.forRoot()
  ],
  providers: [
    RoleGuard,
    SidebarMenuService,
    UserService,
    ProjectService,
    TaskService,
    ChatService,
    CalendarService,
    InviteService,
    TimelineService,
    SnackbarService,
    SocketService,
    NotificationService
  ],
  entryComponents: [CalendarEventDialogComponent]
})

export class PMAppModule {}
