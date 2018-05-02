import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Project, ProjectPosition} from '../../../models/project';
import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material';
import {Title} from '@angular/platform-browser';
import { TruncateModule } from '@yellowspot/ng-truncate';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import {map} from 'rxjs/operators';
import {User} from '../../../models/user';
import {UserService} from '../../../services/user.service';
import {ProjectService} from '../../../services/projects.service';
import {Subscription} from 'rxjs/Subscription';
import {SnackbarService} from '../../../services/snackbar.service';
import {FilterOption, FilterType} from '../../../utils/utils';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {MyDataSource} from '../../../utils/customGenerics';

@Component({
    selector: 'app-pmapp-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
    // Time Ago variables
    projectUpdated: Date;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    selectedIndex = 0;

    user: User;

    displayedColumns = ['Name', 'Budget', 'Description', 'Members', 'Progress'];
    dataSource: MyDataSource<Project> | null;

    filterType = FilterType;
    positionType = ProjectPosition;
    positions = Object.keys(ProjectPosition);
    nameFilter = new BehaviorSubject<FilterOption>(new FilterOption(FilterType.name, ''));
    typeFilter = new BehaviorSubject<FilterOption>(new FilterOption(FilterType.type, 'all'));

    userSubscription: Subscription =  this.userService.user$.subscribe(user => this.user = user);

    constructor(private projectService: ProjectService,
                private userService: UserService ,
                private router: Router,
                private snackBar: SnackbarService,
                private titleService: Title) {}

    openProject(project, path) {
        this.projectService.giveProject(project);
        this.router.navigate(['app', 'project', path]);
    }

    addProject(project: Project) {
      const temp = this.dataSource.data;
      temp.push(project);
      this.projectService.giveProjects(temp);
      this.projectUpdated = new Date();
      this.selectedIndex = 0;
    }

    editProject(index, name) {
      this.dataSource.data[index].name = name;
        this.projectUpdated = new Date();
    }

    ngOnInit() {
      this.titleService.setTitle('My Projects');
      this.dataSource = new MyDataSource<Project>(this.projectService.projects$, this.paginator, true);
      Observable.combineLatest(this.nameFilter.asObservable().pipe(map(value => new FilterOption(value.type, value.value))),
        this.typeFilter.asObservable().pipe(map(value => new FilterOption(value.type, {email: this.user.email, position: value.value}))),
        (name: FilterOption, type: FilterOption) => ({name: name, type: type}))
        .subscribe( filters => this.dataSource.filter = new FilterOption(FilterType.nameType, filters));
    }

    ngOnDestroy() {
          if (this.userSubscription !== undefined) { this.userSubscription.unsubscribe(); }
          this.titleService.setTitle('Project Management');
      }
}


