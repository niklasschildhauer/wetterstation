import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pollen-list-element',
  templateUrl: './pollen-list-element.component.html',
  styleUrls: ['./pollen-list-element.component.scss']
})
export class PollenListElementComponent implements OnInit {
  @Input() title?: string;
  @Input() value?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
