import { Component, OnInit, Input } from '@angular/core';

/**
 * Card element component
 * 
 * This component defines the layout of the tiles (widgets).
 * It takes a subtitle and title. 
 */
@Component({
  selector: 'card-element',
  templateUrl: './card-element.component.html',
  styleUrls: ['./card-element.component.scss']
})
export class CardElementComponent implements OnInit {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() pressable: boolean = false;
  @Input() hideSubtitle: boolean = false;
  @Input() cardSize: CardSize = CardSize.auto
  CardSize = CardSize; // Enum

  constructor() { }

  ngOnInit(): void {
  }

}

/**
 * The size of the widget can be changed through using this
 * enum values. 
 */
export enum CardSize {
  small, // Sets the size of the card to fixed small values
  auto // Card grows on his own behalf
}
