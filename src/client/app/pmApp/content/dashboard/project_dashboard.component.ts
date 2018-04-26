import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ProjectService} from '../../../services/projects.service';
import {Title} from '@angular/platform-browser';
import {TaskService} from '../../../services/task.service';
import {Router} from '@angular/router';
import {Task} from '../../../models/task';
import {Project} from '../../../models/project';

@Component({
  selector: 'app-pmapp-project-dashboard',
  templateUrl: './project_dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class ProjectDashboardComponent implements OnDestroy {
  assignments: Task[];
  project: Project;
  projectSubscription: Subscription = this.projectService.project$.subscribe( project => this.project = project);
  assignmentsSubscription: Subscription = this.taskService.assignments$.subscribe( assignments => this.assignments = assignments);

  constructor(private projectService: ProjectService,
              private titleService: Title,
              private taskService: TaskService,
              private router: Router) {}

  ngOnDestroy() {
    if (this.projectSubscription !== undefined) { this.projectSubscription.unsubscribe(); }
    if (this.assignmentsSubscription !== undefined) { this.assignmentsSubscription.unsubscribe(); }
  }
  }
