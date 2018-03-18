import { Injectable } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

@Injectable()
export class ScrollService {

  constructor(private _scrollToService: ScrollToService) { }

  public triggerScrollOn(container: string, target: string) {
    const config: ScrollToConfigOptions = {
      container: container,
      target: target,
      duration: 650,
      easing: 'easeOutElastic',
      offset: 20
    };
    this._scrollToService.scrollTo(config);
  }
  public triggerScrollTo(target: string) {
    this._scrollToService.scrollTo({target: target});
  }
}
