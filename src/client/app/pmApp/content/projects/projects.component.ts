import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {Member, Project} from '../../../models/project';
import {Router} from '@angular/router';
import {MatPaginator, MatSnackBar} from '@angular/material';
import {Title} from '@angular/platform-browser';

import { DataSource} from '@angular/cdk/table';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import {User} from '../../../models/user';
import {UserService} from '../../../services/user.service';
import {ProjectService} from '../../../services/projects.service';
import {Subscription} from 'rxjs/Subscription';
import {TaskService} from '../../../services/task.service';
import {TaskType} from '../../../models/task';

class ExampleDataSource extends DataSource<any> {
    constructor( private projectService: ProjectService,
                 private _paginator: MatPaginator) {
        super();
        this.projectService.projects$.subscribe(projects => this.projects = projects);
    }
    projects: Project[];

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Project[]> {
        const displayDataChanges = [
            this.projectService.projects$,
            this._paginator.page
        ];

        return Observable.merge(...displayDataChanges).map(() => {
            const cdata = this.projects.slice();
            const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
            return cdata.splice(startIndex, this._paginator.pageSize);
        });
    }
    disconnect() { }
}

@Component({
    selector: 'app-pmapp-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
    // Time Ago variables
    projectUpdated: Date;

    @ViewChild('tab') tabGroup;
    user: User;
    projects: Project[] = [];
    position = 'manager';
    positions = ['manager', 'member'];

    displayedColumns = ['Name', 'Budget', 'Description', 'Members', 'Progress'];
    dataSource: ExampleDataSource | null;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    projectsSubscription: Subscription = this.projectService.projects$.subscribe(
        projects => {
            this.projects = projects;
            this.projectUpdated = new Date();
        });
    userSubscription: Subscription =  this.userService.user$.subscribe(
        profile => this.user = profile);

    constructor(private projectService: ProjectService,
                private userService: UserService ,
                private router: Router,
                public snackBar: MatSnackBar,
                private titleService: Title,
                private taskService: TaskService) {
    }

    positionSearch(team) {
        for (const member of team) {
            if (member.email === this.user.email && member.position === this.position) { return true; }
        }
        return false;
    }

    openProjectDashboard(id) {
        const index = this.projects.findIndex(project => project._id === id);
        this.projectService.giveProject(this.projects[index]);
        this.router.navigate(['app', 'project', 'dashboard']);
    }

    openProjectTeam(id) {
        const index = this.projects.findIndex(project => project._id === id);
        this.projectService.giveProject(this.projects[index]);
        this.router.navigate(['app', 'project', 'team']);
    }

    addProject(project: Project) {
        this.projects.push(project);
        this.projectService.giveProjects(this.projects);
        this.projectUpdated = new Date();
        this.tabGroup.selectedIndex = 0;
    }

    editProject(index, name) {
        this.projects[index].name = name;
        this.projectUpdated = new Date();
    }

    openSnackBar(message, action, duration) {
        this.snackBar.open(message, action, duration);
    }


    ngOnInit() {
        this.titleService.setTitle('My Projects');
        this.dataSource = new ExampleDataSource(this.projectService, this.paginator);
    }

    ngOnDestroy() {
        if (this.userSubscription !== undefined) { this.userSubscription.unsubscribe(); }
        if (this.projectsSubscription !== undefined) { this.projectsSubscription.unsubscribe(); }
        this.titleService.setTitle('Project Management');
    }
}
