import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calibration-info-detail-view',
  templateUrl: './calibration-info-detail-view.component.html',
  styleUrls: ['./calibration-info-detail-view.component.scss']
})
export class CalibrationInfoDetailViewComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  gotIt(): void {
    this.router.navigateByUrl('/dashboard');
  }

}
