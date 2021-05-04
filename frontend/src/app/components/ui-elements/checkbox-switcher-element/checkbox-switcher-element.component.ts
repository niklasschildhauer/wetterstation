import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-checkbox-switcher-element',
  templateUrl: './checkbox-switcher-element.component.html',
  styleUrls: ['./checkbox-switcher-element.component.scss']
})
export class CheckboxSwitcherElementComponent implements OnInit {
  @Input() label?: string;
  @Input() value: boolean = false;

  @Output() toggled = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  toggleCheckbox(event: any) {
    this.toggled.emit(event.target.checked);
  }

}
