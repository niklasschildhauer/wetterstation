import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

/**
 * Slider element component
 * 
 * Control element in form of a slider. 
 */
@Component({
  selector: 'app-slider-element',
  templateUrl: './slider-element.component.html',
  styleUrls: ['./slider-element.component.scss']
})
export class SliderElementComponent implements OnInit {
  @Input() value?: number; 
  @Input() label?: string;

  model: number = 78;

  @Output() valueChanged = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Emits the output event to inform the parent component
   * that the value has changed.
   */
  changeValue(event: any) {
    this.valueChanged.emit(event.target.value);
  }
}
