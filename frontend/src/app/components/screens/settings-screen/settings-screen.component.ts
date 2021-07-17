import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeTransitionAnimations } from '../../../route-transition-animation';

/**
 * Settings screen component 
 * 
 * Wrapper component to display all settings view components.
 */
@Component({
  selector: 'app-settings-screen',
  templateUrl: './settings-screen.component.html',
  styleUrls: ['./settings-screen.component.scss'],
  animations: [routeTransitionAnimations],
})
export class SettingsScreenComponent implements OnInit {
  desktop: boolean = false;

  constructor() { }

  ngOnInit(): void { 
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animationState'];
  }
}
