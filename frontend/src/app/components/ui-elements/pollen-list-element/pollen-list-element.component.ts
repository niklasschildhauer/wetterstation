import { Component, Input, OnInit } from '@angular/core';

/**
 * Pollen list element component
 * 
 * This component is a list entry which uses the pollen tag element.
 * In addition to the pollen tag element it also displays a name label.
 */
@Component({
  selector: 'app-pollen-list-element',
  templateUrl: './pollen-list-element.component.html',
  styleUrls: ['./pollen-list-element.component.scss']
})
export class PollenListElementComponent implements OnInit {
  @Input() title?: string;
  @Input() value?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
