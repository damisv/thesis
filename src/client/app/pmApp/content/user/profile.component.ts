import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Title} from '@angular/platform-browser';
// import {NotificationService} from '../../_services/notification.service';
import {User} from '../../../models/user';
import {UserService} from '../../../services/user.service';
import {ProjectService} from '../../../services/projects.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {map, startWith} from 'rxjs/operators';
import {countryCodes} from '../../../utils/utils';

@Component({
    selector: 'app-pmapp-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  step = 0;
  countryCtrl: FormControl;
  filteredCountries: Observable<any[]>;
  countries = countryCodes;
  // Properties
  user: User;
  activeProjects: number;
  // Subscriptions
  userSubscription: Subscription = this.userService.user$.subscribe(user => this.user = user);
  projectsSubscription: Subscription = this.projectService.projects$.subscribe(project => this.activeProjects = project.length);

  constructor (private userService: UserService,
               private titleService: Title,
               // private notificationService:NotificationService,
               private projectService: ProjectService) {
    this.countryCtrl = new FormControl();
    this.filteredCountries = this.countryCtrl.valueChanges
      .pipe(
        startWith(''),
        map(country => country ? this.filterCountries(country) : this.countries.slice())
      );
  }

  private filterCountries(value) {
    return this.countries.filter(country => country.name.toLowerCase().indexOf(value.toLowerCase()) === 0);
  }

  onSubmit() {
      if (this.user.email) {
          this.userService.edit(this.user)
              .subscribe(_ => this.userService.giveUserProfile(this.user),
                  error => {
                      console.error(error);
                      // this.notificationService.create('error', 'Error!', 'An error occured while saving profile changes', 'error');
                  }
              );
      }
  }

  ngOnInit() { this.titleService.setTitle('My Profile'); }
  ngOnDestroy() {
    if (this.userSubscription !== undefined) { this.userSubscription.unsubscribe(); }
    if (this.projectsSubscription !== undefined) { this.projectsSubscription.unsubscribe(); }
    this.titleService.setTitle('Project Management');
  }

  // Expansion Panel Accordion methods
  setStep(index) { this.step = index; }
  nextStep() { this.step++; }
  prevStep() { this.step--; }
}
