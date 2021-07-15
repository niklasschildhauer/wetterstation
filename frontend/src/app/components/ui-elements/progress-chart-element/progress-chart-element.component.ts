import { Component, Input, OnInit } from '@angular/core';

/**
 * Progress chart element component
 * 
 * Displays the current value relative to max and optimal value.
 * It indicates if the value is good or bad. @Carina
 */
@Component({
  selector: 'app-progress-chart-element',
  templateUrl: './progress-chart-element.component.html',
  styleUrls: ['./progress-chart-element.component.scss']
})
export class ProgressChartElementComponent implements OnInit {
  @Input() value: number = 50;
  @Input() maxValue: number = 100;
  @Input() optimalValue: number = 25;

  constructor() { }

  ngOnInit(): void { }
}
