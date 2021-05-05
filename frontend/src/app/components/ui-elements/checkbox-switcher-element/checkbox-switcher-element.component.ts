import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox-switcher-element',
  templateUrl: './checkbox-switcher-element.component.html',
  styleUrls: ['./checkbox-switcher-element.component.scss']
})
export class CheckboxSwitcherElementComponent implements OnInit {
  @Input() label?: string;
  @Input() value?: boolean;
  @Input() checkedImage?: string;
  @Input() unCheckedImage?: string;
  @Output() toggled = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  toggleCheckbox() {
    this.toggled.emit(!this.value);
  }

}
