import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-progress-chart-element',
  templateUrl: './progress-chart-element.component.html',
  styleUrls: ['./progress-chart-element.component.scss']
})
export class ProgressChartElementComponent implements OnInit {
  // @ViewChild('progressbar') input?: HTMLInputElement;
  @Input() value?: string;
  
  constructor() { 
  }

  ngOnInit(): void {
  }

}
