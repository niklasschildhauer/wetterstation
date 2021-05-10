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
  @Input() cardSize: CardSize = CardSize.auto
  CardSize = CardSize; // Enum

  constructor() { }

  ngOnInit(): void {
  }

}

// FIXME: needs a place to live
export enum CardSize {
  small, // Sets the size of the card to fixed small values
  auto // Card grows on his own behalf
}
