import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Calibration info detail view component
 * 
 * This component displays an information text about the 
 * calibration process. It has no logic, only a button which can be
 * pressed. If the button is pressed, it will redirect the
 * user back to the dashboard.
 */
@Component({
  selector: 'app-calibration-info-detail-view',
  templateUrl: './calibration-info-detail-view.component.html',
  styleUrls: ['./calibration-info-detail-view.component.scss']
})
export class CalibrationInfoDetailViewComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Redirect to the dashboard screen
   */
  gotIt(): void {
    this.router.navigateByUrl('/dashboard');
  }

}
