import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {User} from '../../../models/index';
import {day, getCorrectDays, getRandomColor} from '../../../utils/utils';
import {TaskService, ProjectService, UserService} from '../../../services/index';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-pmapp-myassignments',
  templateUrl: './myassignments.component.html',
  styleUrls: ['./myassignments.component.scss']
})
export class MyAssignmentsComponent implements OnDestroy, AfterViewInit {
  // Properties
  user: User;
  ganttUpdated: Date;
  private type: string;

  constructor(private taskService: TaskService,
              private projectService: ProjectService,
              private userService: UserService,
              private titleService: Title,
              private route: ActivatedRoute,
              private router: Router) {
    userService.user$.subscribe(user => this.user = user);
  }

  ngAfterViewInit() {
    this.route.data
      .subscribe(data => {
        this.type = data.type;
        this.taskService.get(data.type)
          .subscribe(res => this.initData(res), error => {});
      });
  }

  private initData(res) {
    let min = getCorrectDays(new Date());
    let max = 0;
    const data = new Map<string, any[]>(); // hashmap: key is project_id, value: assignments
    for (const assignment of res) { // populate the hashmap
      if (data.has(assignment.project_id)) {
        const temp = data.get(assignment.project_id);
        temp.push(assignment);
        data.set(assignment.project_id, temp);
      } else { data.set(assignment.project_id, [assignment]); }
    }
    const chartData = []; // data to add to chart
    Array.from(data.keys()).forEach(value => {
      const assignments = data.get(value);
      const dataTemp = [];
      // the following is needed so that the project name would be visible and grouped
      dataTemp.push({taskName: data.get(value)[0].project_name, id: value});
      //
      for (const assignment of assignments) {
        min = Math.min(getCorrectDays(assignment.date_start), min);
        max = Math.max(getCorrectDays(assignment.date_end), max);
        dataTemp.push({ taskName: assignment.name, id: assignment._id, parent: value,
                        start: new Date(assignment.date_start).getTime(),
                        end: new Date(assignment.date_end).getTime()
        });
      }
      chartData.push({ name: data.get(value)[0].project_name, color: getRandomColor(), data: dataTemp});
    });
    this.initHighGantt(min, max + (2 * day), chartData);
  }

  /*
    Highcharts Gantt
     */
  initHighGantt(min, max, data) {
    const today = getCorrectDays(new Date());
    if (min < 1) { min = today - (5 * day); }
    if (max < 1) { max = today + (15 * day); }

    Highcharts.ganttChart('container', {
      title: { text: `${this.user.firstName}'s ${this.type}` },
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
  ngOnDestroy() { this.titleService.setTitle('Project Management'); }
}
