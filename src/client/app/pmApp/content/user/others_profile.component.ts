import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../services/user.service';
import {User} from '../../../models/user';
import {Subscription} from 'rxjs/Subscription';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'app-pmapp-profile-others',
    templateUrl: './others_profile.component.html',
    styleUrls: ['./others_profile.component.css']
})
export class OthersProfileComponent implements OnInit, OnDestroy {
    profile: User = null;
    subscription: Subscription;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private userService: UserService,
                private titleService: Title) {}

    ngOnInit() {
        this.subscription = this.userService.user$.subscribe(
            profile => {
                this.profile = profile;
                if (profile) {
                    this.route.params.subscribe(params => {
                        if (params.id) {
                            if (this.profile.email === (params.id)) {
                                this.router.navigateByUrl('app/profile');
                                return;
                            }
                            this.userService.getFor(params.id).subscribe(
                                data => {
                                    this.profile = data.profile;
                                    this.titleService.setTitle(this.profile.firstName + '\'s profile');
                                },
                                error => console.error(error)
                            );
                        }
                    });
                }
            });
    }

    ngOnDestroy() {
        if (this.subscription !== undefined) { this.subscription.unsubscribe(); }
        this.titleService.setTitle('Project Management');
    }
}
