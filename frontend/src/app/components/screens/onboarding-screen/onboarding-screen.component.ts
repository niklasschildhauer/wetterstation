import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeTransitionAnimations } from '../../../route-transition-animation';

/**
 * Onboarding screen component 
 * 
 * Wrapper component to display the login view, register 
 * and personalization view components.
 */
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
