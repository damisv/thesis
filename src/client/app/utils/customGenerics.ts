import {DataSource} from '@angular/cdk/table';
import {applyFilter, FilterOption} from './utils';
import {MatPaginator} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

// Simple Datasource
export class MySimpleDataSource<T> extends DataSource<T> {
  data: T[];

  constructor(private dataObservable: Observable<T[]>) {
    super();
    this.dataObservable.subscribe(data => this.data = data);
  }

  connect(): Observable<T[]> { return this.dataObservable; }
  disconnect() {}
}

// Elaborate Data source
export class MyDataSource<T> extends DataSource<T> {
  data: T[];

  _filterChange = new BehaviorSubject<FilterOption>(null);

  get filter(): FilterOption {
    return this._filterChange.value;
  }

  set filter(filter: FilterOption) {
    this._filterChange.next(filter);
  }

  constructor(private dataObservable: Observable<T[]>,
              private _paginator: MatPaginator,
              private projectType: boolean = false) {
    super();
    this.dataObservable.subscribe(data => this.data = data);
  }

  connect(): Observable<T[]> {
    const displayDataChanges = [
      this.dataObservable,
      this._paginator.page,
      this._filterChange
    ];
    return Observable.merge(...displayDataChanges).map(() => {
      const cdata = this.data.slice();
      const filtered = cdata.filter(project => applyFilter(this.filter, project, this.projectType));
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this._paginator.length = filtered.length;
      return filtered.splice(startIndex, this._paginator.pageSize);
    });
  }

  disconnect() {}
}
