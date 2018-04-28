import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {Subscription} from 'rxjs/Subscription';
import {UserService} from '../../../services/user.service';
import {TaskService} from '../../../services/task.service';
import {ProjectService} from '../../../services/projects.service';
import {User} from '../../../models/user';
import {Member, Project, ProjectPosition} from '../../../models/project';
import {Task, TaskType} from '../../../models/task';

@Component({
    selector: 'app-pmapp-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    position = ProjectPosition; // Enum is not available otherwise into the html
    projectUpdated: Date;
    tasksUpdated: Date;
    user: User;
    projects: Project[];
    tasks: Task[];
    issues: Task[];

    subscription: Subscription  = this.userService.user$.subscribe(
      user => {
            this.user = user;
            this.titleService.setTitle(this.user.firstName + '\'s Dashboard');
        }
    );
    projectSubscription: Subscription = this.projectService.projects$.subscribe(
        projects => {
            this.projects = projects;
            this.projectUpdated = new Date();
        }
    );

    constructor(private userService: UserService,
                private titleService: Title,
                private projectService: ProjectService,
                private router: Router,
                private taskService: TaskService) {
    }

    ngOnInit() {
        this.taskService.get('task').subscribe(
            res => {
                this.tasks = res.tasks;
                this.tasksUpdated = new Date();
            }
        );
      this.taskService.get('issue').subscribe(
        res => {
          this.issues = res.tasks;
          // this.tasksUpdated = new Date();
        }
      );
    }

    openProjectDashboard(index) {
        this.projectService.giveProject(this.projects[index]);
        this.router.navigate(['app', 'project', 'dashboard']);
    }

    openTaskView(task: Task) {
        // this.taskService.giveTask(task);
        this.router.navigate(['app', 'project', `assignmentview/${task._id}`]);
    }

    isTypeOf(position: ProjectPosition, team: Member[]) {
        for (const member of team) {
            if (this.user.email === member.email && member.position === position) {
                return true;
            }
        }
        return false;
    }
    ngOnDestroy() {
        if (this.subscription !== undefined) { this.subscription.unsubscribe(); }
        if (this.projectSubscription !== undefined) { this.projectSubscription.unsubscribe(); }
        this.titleService.setTitle('Project Management');
    }
}
