import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {Member, Project, ProjectPosition} from '../../../models/project';
import {Router} from '@angular/router';
import {MatPaginator, MatSnackBar, MatTableDataSource} from '@angular/material';
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
import {SnackbarService} from '../../../services/snackbar.service';
import {applyFilter, FilterOption, FilterType} from '../../../utils/utils';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {map} from 'rxjs/operators';
import {Task} from '../../../models/task';

@Component({
    selector: 'app-pmapp-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
    // Time Ago variables
    projectUpdated: Date;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    selectedIndex = 0;

    user: User;

    displayedColumns = ['Name', 'Budget', 'Description', 'Members', 'Progress'];
    dataSource = new MatTableDataSource<Project>();

    filterType = FilterType;
    positionType = ProjectPosition;
    positions = Object.keys(ProjectPosition);
    nameFilter = new BehaviorSubject<FilterOption>({type: FilterType.name, value: ''});
    typeFilter = new BehaviorSubject<FilterOption>({type: FilterType.type, value: 'all'});

    projectsSubscription: Subscription = this.projectService.projects$.subscribe(
        projects => {
            this.dataSource.data = projects;
            this.projectUpdated = new Date();
        });
    userSubscription: Subscription =  this.userService.user$.subscribe(user => this.user = user);

    constructor(private projectService: ProjectService,
                private userService: UserService ,
                private router: Router,
                private snackBar: SnackbarService,
                private titleService: Title) {
      this.dataSource.filterPredicate =
        (data: Project, filter: string) => applyFilter(JSON.parse(filter), data);
      Observable.combineLatest(this.nameFilter.asObservable().pipe(map(value => new FilterOption(value.type, value.value))),
        this.typeFilter.asObservable().pipe(map(value => new FilterOption(value.type, {email: this.user.email, position: value.value}))),
        (name: FilterOption, type: FilterOption) => ({name: name, type: type}))
          .subscribe( filters => this.filterBy(FilterType.nameType, filters));
    }

    private filterBy(type: FilterType, value) { this.dataSource.filter = JSON.stringify(new FilterOption(type, value)); }

    openProject(project, path) {
        this.projectService.giveProject(project);
        this.router.navigate(['app', 'project', path]);
    }

    addProject(project: Project) {
      this.dataSource.data.push(project);
      this.projectService.giveProjects(this.dataSource.data);
      this.projectUpdated = new Date();
      this.selectedIndex = 0;
    }

    editProject(index, name) {
        this.dataSource.data[index].name = name;
        this.projectUpdated = new Date();
    }

    ngOnInit() { this.titleService.setTitle('My Projects'); }

    ngAfterViewInit() { this.dataSource.paginator = this.paginator; }

    ngOnDestroy() {
          if (this.userSubscription !== undefined) { this.userSubscription.unsubscribe(); }
          if (this.projectsSubscription !== undefined) { this.projectsSubscription.unsubscribe(); }
          this.titleService.setTitle('Project Management');
      }
}
