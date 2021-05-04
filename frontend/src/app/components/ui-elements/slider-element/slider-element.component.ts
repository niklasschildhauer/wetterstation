import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-slider-element',
  templateUrl: './slider-element.component.html',
  styleUrls: ['./slider-element.component.scss']
})
export class SliderElementComponent implements OnInit {
  @Input() value?: number; 
  @Input() label?: string;

  @Output() valueChanged = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  changeValue(event: any) {
    this.valueChanged.emit(event.target.value);
  }

}
