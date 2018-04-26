import {Component, OnInit} from '@angular/core';
import {MaterialTheme, ThemeService} from '../services/theme.service';
import {distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-particles',
  template: `<particles [style]="style" [params]="params"></particles>`,
  styles: []
})
export class ParticlesComponent implements OnInit {
  // Properties
  style: object = {};
  params: object = {};
  width = 100;
  height = 100;

  isDark: boolean;

  constructor(private themeService: ThemeService) {
    themeService.currentTheme$
      .pipe(distinctUntilChanged())
      .subscribe( theme => this.isDark = ThemeService.isDark(theme)); // TODO: change particles color ?
  }

  ngOnInit() {
    this.style = {
      'position': 'fixed',
      'width': '100%',
      'height': '100%',
      'z-index': -1,
      'top': 0,
      'left': 0,
      'right': 0,
      'bottom': 0,
    };

    this.params = {
      particles: {
        number: {
          value: 130,
        },
        color: {
          value: '#2a43ca'
        },
        shape: {
          type: 'circle'
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: false,
            speed: 50,
            opacity_min: 0.1,
            sync: true
          }
        },
        line_linked: {
          enable: true,
          color: '#4f4fca'
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'repulse'
          },
          onclick: {
            enable: true,
            mode: 'bubble'
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 200,
            line_linked: {
              opacity: 1
            }
          },
          bubble: {
            distance: 200,
            size: 80,
            duration: 0.4
          },
          repulse: {
            distance: 200,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        },
        mouse: {}
      },
      retina_detect: true
    };
  }
}
