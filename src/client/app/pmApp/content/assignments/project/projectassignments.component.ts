import {Component} from '@angular/core';
import {ProjectService} from '../../../../services/projects.service';
import {Project} from '../../../../models/project';
import {TaskService} from '../../../../services/task.service';
import {SnackbarService} from '../../../../services/snackbar.service';

@Component({
  selector: 'app-pmapp-project-assignments',
  templateUrl: './projectassignments.component.html',
  styleUrls: ['./projectassignments.component.scss']
})
export class ProjectAssignmentsComponent {
  project: Project;
  selectedTab = 0;

  constructor(private projectService: ProjectService,
              private taskService: TaskService,
              private snackBar: SnackbarService) {
    projectService.project$.subscribe(project => this.project = project);
  }

  create(task) {
    this.taskService.create(task)
      .subscribe( _ => {
        this.taskService.add(task);
        this.snackBar.show(task.name + ' successfully created!');
        this.changeTab();
      },
        err => this.snackBar.show('Error occurred on creating task. Try again.'));
  }

  private changeTab() { this.selectedTab = 0; }
}
