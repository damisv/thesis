import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Task, TaskType} from '../../../models/task';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Project} from '../../../models/project';

@Component({
  selector: 'app-pmapp-project-assignments-single',
  templateUrl: './projectassignment.component.html',
  styleUrls: ['./projectassignment.component.scss']
})
export class ProjectAssignmentComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  data: string;
  taskType = TaskType;
  types = Object.keys(TaskType);
  filterType = FilterType;

  displayedColumns = ['status', 'type', 'name', 'assigner_email', 'assignee', 'end_date'];
  dataSource = new MatTableDataSource<Task>([
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of First Issue', '', ['test@test.com', 'test@test12.com']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Second Issue', '', ['test@test.com', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Third Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fourth Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fifth Task', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Sixth Issue', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of First Issue', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Second Issue', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Third Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fourth Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fifth Task', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Sixth Issue', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of First Issue', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Second Issue', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Third Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fourth Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fifth Task', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Sixth Issue', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of First Issue', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Second Issue', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Third Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fourth Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fifth Task', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Sixth Issue', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of First Issue', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Second Issue', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Third Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fourth Task', '', ['', '']),
    new Task(TaskType.task, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Fifth Task', '', ['', '']),
    new Task(TaskType.issue, 'project_id', 'project_name', 'assigner@email.com', 'Name Of Sixth Issue', '', ['', ''])
  ]);
  project: Project;

  constructor(private route: ActivatedRoute) {
    this.route.data
      .subscribe(data => this.data = data.type );
    this.dataSource.filterPredicate =
      (data: Task, filter: string) => this.applyFilter(JSON.parse(filter), data);
  }

  filterBy(type: FilterType, value) { this.dataSource.filter = JSON.stringify(new FilterOption(type, value)); }

  ngAfterViewInit() { this.dataSource.paginator = this.paginator; }

  openTask(id: string) { console.log(id); }

  applyFilter(filter: FilterOption, task: Task): boolean {
    switch (filter.type) {
      case FilterType.status:
        return filter.value === 'all' ? true : filter.value === true.toString(); // dev
      case FilterType.name:
        // let temp = filter.value.trim();
        // temp = temp.toLowerCase();
        return task.name.trim().toLowerCase().includes(filter.value) ||
          task.assigner_email.toLowerCase().includes(filter.value) ||
          task.assignee_email.includes(filter.value);
      case FilterType.assigner:
        return task.assigner_email === filter.value;
      case FilterType.assignee:
        return task.assignee_email.includes(filter.value);
    }
  }
}

class FilterOption {
  constructor(public type: FilterType, public value: any) {}
}
enum FilterType {
  status, name, assigner, assignee
}
