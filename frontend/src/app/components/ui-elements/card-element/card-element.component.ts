import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'card-element',
  templateUrl: './card-element.component.html',
  styleUrls: ['./card-element.component.scss']
})
export class CardElementComponent implements OnInit {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() pressable: boolean = false;


  constructor() { }

  ngOnInit(): void {
  }

}
