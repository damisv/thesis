import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class ProgressBarService {
    // Properties
    private progressBar = new BehaviorSubject<boolean>(false);
    progressBar$ = this.progressBar.asObservable();

    constructor() {}

    availableProgress(state: boolean) { this.progressBar.next(state); }
}
