import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Personalization view component
 *
 * Is the wrapper for the personalization settings view component.
 * It displays the navigation bar with the correct title and back button.
 */
@Component({
  selector: 'app-personalization-view',
  templateUrl: './personalization-view.component.html',
  styleUrls: ['./personalization-view.component.scss']
})
export class PersonalizationViewComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Redirects to the Dashboard screen
   */
  onClickDone() {
    this.router.navigateByUrl('/dashboard');
  }

}
