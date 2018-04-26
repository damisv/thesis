import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {User} from '../../../models/user';
import {day, getCorrectDays, getRandomColor} from '../../../utils/utils';
import {TaskService} from '../../../services/task.service';
import {ProjectService} from '../../../services/projects.service';
import {UserService} from '../../../services/user.service';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-pmapp-myassignments',
  templateUrl: './myassignments.component.html',
  styleUrls: ['./myassignments.component.scss']
})
export class MyAssignmentsComponent implements OnDestroy, AfterViewInit {
  // Properties
  user: User;
  ganttUpdated: Date;
  private dataH = [];
  private type: string;

  constructor(private taskService: TaskService,
              private projectService: ProjectService,
              private userService: UserService,
              private titleService: Title,
              private route: ActivatedRoute) {}

  ngAfterViewInit() {
    this.route.data
      .subscribe(data => {
        this.type = data.type;
        this.taskService.get(data.type)
          .subscribe(res => this.initData(res), error => {});
      });
  }
  initData(res) {
    let min = getCorrectDays(new Date());
    let max = 0;
    for (const value of res) {
      this.dataH.push({
        name: value.project.name,
        color: getRandomColor(),
        data : [{
          taskName: value.project.name,
          id: value.project._id,
        }]
      });
      for (const task of value.tasks) {
        try {
          const tempMin = getCorrectDays(task.date_start);
          if (tempMin < min) { min = tempMin; }
          const tempMax = getCorrectDays(task.date_end);
          if (tempMax > max) { max = tempMax; }
        } catch (e) { console.log(e); }
        this.dataH[this.dataH.length - 1].data.push({
          taskName: task.name,
          id: task._id,
          parent: value.project._id,
          start: new Date(task.date_start).getTime(),
          end: new Date(task.date_end).getTime()
        });
      }
    }
    this.initHighGantt(min, max + (2 * day));
  }

  /*
    Highcharts Gantt
     */
  initHighGantt(min, max) {
    const today = getCorrectDays(new Date());
    if (min < 1) { min = today - (5 * day); }
    if (max < 1) { max = today + (15 * day); }

    Highcharts.ganttChart('container', {
      title: {
        text: '\'s' + this.type
      },
      xAxis: {
        currentDateIndicator: true,
        min: min,
        max: max
      },
      series: this.dataH,
      responsive: {
        rules: [{
          condition: {
            maxWidth: 200,
            maxHeight: 250
          },
          chartOptions: {
            legend: {
              enabled: false
            }
          }
        }]
      }
    });
  }

  ngOnDestroy() { this.titleService.setTitle('Project Management'); }
}
