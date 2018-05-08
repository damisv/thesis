import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ProjectService} from '../../../services/projects.service';
import {Title} from '@angular/platform-browser';
import {TaskService} from '../../../services/task.service';
import {Router} from '@angular/router';
import {Task, TaskType} from '../../../models/task';
import {Project} from '../../../models/project';

@Component({
  selector: 'app-pmapp-project-dashboard',
  templateUrl: './project_dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class ProjectDashboardComponent implements AfterViewInit, OnDestroy {
  assignments: Task[];
  taskAvailable = true;
  issueAvailable = true;
  project: Project;
  projectSubscription: Subscription = this.projectService.project$.subscribe( project => this.project = project);
  assignmentsSubscription: Subscription;

  constructor(private projectService: ProjectService,
              private titleService: Title,
              private taskService: TaskService,
              private router: Router) {}

  ngOnDestroy() {
    if (this.projectSubscription !== undefined) { this.projectSubscription.unsubscribe(); }
    if (this.assignmentsSubscription !== undefined) { this.assignmentsSubscription.unsubscribe(); }
  }

  ngAfterViewInit() {
    this.assignmentsSubscription = this.taskService.assignments$.subscribe(assignments => {
      this.assignments = assignments;
      this.initCharts(assignments);
    });
  }

  private initCharts(assignments: Task[]) {
    const tasks: Task[] = [];
    const issues: Task[] = [];
    for (const assignment of assignments) {
      assignment.type === TaskType.task ? tasks.push(assignment) : issues.push(assignment);
    }
    this.initChart(tasks, 'taskChartContainer', 'Task Statistics', 'Task Statistics ');
    this.taskAvailable = tasks.length !== 0;
    this.initChart(issues, 'issuesChartContainer', 'Issue Statistics', 'Issue Statistics ');
    this.issueAvailable = issues.length !== 0;
  }

  protected initChart(tasks: Task[], elementId: string, title: string, seriesName: string = title) {
    const completed = tasks.filter(value => value.completed).length;
    const inProgress = tasks.length - completed;
    const data = [{name: 'Completed', y: completed, sliced: true, selected: true},
                  {name: 'In Progress', y: inProgress}];
    this.pieChart(elementId, title, seriesName, data);
  }

  pieChart(elementID: string, title: string, seriesName: string, data: any[]) {
    Highcharts.chart(elementID, {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: title
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          },
          showInLegend: true
        }
      },
      series: [{
        name: seriesName,
        colorByPoint: true,
        data: data
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 200,
            maxHeight: 250
          },
          chartOptions: { legend: { enabled: false } }
        }]
      }
    });
  }
}
