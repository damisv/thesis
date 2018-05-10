import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {day, getCorrectDays} from '../../../utils/utils';
import {ProjectService, TaskService} from '../../../services';
import {Router} from '@angular/router';
import {Project, Task} from '../../../models';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-pmapp-project-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss']
})
export class GanttComponent implements AfterViewInit, OnDestroy {
  project: Project;
  available = true;
  assignments: Task[] = [];
  taskSubscription: Subscription;
  private tasks: Task[];
  private chart;

  constructor(private projectService: ProjectService,
              private taskService: TaskService,
              private router: Router) {
    projectService.project$.subscribe(project => this.project = project);
  }

  ngAfterViewInit() {
    this.taskSubscription = this.taskService.assignments$.subscribe( assignments => {
      this.assignments = assignments;
      this.tasks = assignments.filter(value => value.type === 0);
      this.initChartData(this.tasks);
    });
  }

  private initChartData(data: Task[]) {
    if (data.length === 0) { this.available = false; return; }
    const tempData = [];
    let min = getCorrectDays();
    let max = 0;
    for (const value of data) {
      min = Math.min(getCorrectDays(value.date_start), min);
      max = Math.max(getCorrectDays(value.date_end), max);
      tempData.push({
        taskName: value.name,
        id: value._id,
        start: getCorrectDays(value.date_start),
        end: getCorrectDays(value.date_end),
        dependency: value.dependencies.map(val => [val.taskID]).join()
      });
    }
    this.initGantt(min, max + 2 * day, [{ name: this.project.name, data: tempData}]);
  }

  private initGantt(min, max, data) {
    const today = getCorrectDays(new Date());
    if (min < 1) { min = today - (5 * day); }
    if (max < 1) { max = today + (15 * day); }

    this.chart = Highcharts.ganttChart('ganttChartContainer', {
      title: { text: `Tasks` },
      xAxis: { currentDateIndicator: true, min: min, max: max},
      plotOptions: {
        series: {
          cursor: 'pointer',
          events: { click: event => { this.router.navigate(['app', 'assignmentview', event.point.id]); }}}
      },
      series: data,
      responsive: {
        rules: [{
          condition: { maxWidth: 200,  maxHeight: 250 },
          chartOptions: { legend: { enabled: false } }
        }]
      }
    });
  }

  ngOnDestroy() {
    if (this.taskSubscription) { this.taskSubscription.unsubscribe(); }
  }
}
