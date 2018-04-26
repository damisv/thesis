import {Component, OnDestroy} from '@angular/core';
import {ProjectService} from '../../../services/projects.service';
import {Subscription} from 'rxjs/Subscription';
import {Title} from '@angular/platform-browser';
import {Project} from '../../../models/project';
import { TruncateModule } from '@yellowspot/ng-truncate';

@Component({
  selector: 'app-pmapp-project-settings',
  templateUrl: './project_settings.component.html',
  styleUrls: ['./project_settings.component.scss']
})
export class ProjectSettingsComponent implements OnDestroy {

  project = new Project('');

  projectSubscriptions: Subscription = this.projectService.project$.subscribe(
    project => {
      this.project = project;
      this.titleService.setTitle(this.project.name + '\'s Settings');
    }
  );

  constructor(private projectService: ProjectService,
              private titleService: Title) {}

  setPrivacy(status: boolean) { this.project.typeOf = status ? 'private' : 'public'; }

  save() {
    this.projectService.edit(this.project)
      .subscribe(
        res => {},
        err => {}
      );
  }

  delete() {
   this.projectService.delete(this.project)
     .subscribe(
       res => {/* go to user dashboard, reload projects ...*/},
       err => {}
     );
  }
  ngOnDestroy() { this.projectSubscriptions.unsubscribe(); }
}
