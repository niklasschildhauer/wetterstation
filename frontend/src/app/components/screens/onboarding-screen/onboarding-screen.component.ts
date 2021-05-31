import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeTransitionAnimations } from '../../../route-transition-animation';


@Component({
  selector: 'app-onboarding-screen',
  templateUrl: './onboarding-screen.component.html',
  styleUrls: ['./onboarding-screen.component.scss'],
  animations: [routeTransitionAnimations],
})
export class OnboardingScreenComponent implements OnInit {
  public desktop: boolean = false;

  constructor() { }

  ngOnInit(): void {}


  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animationState'];
  }

}
