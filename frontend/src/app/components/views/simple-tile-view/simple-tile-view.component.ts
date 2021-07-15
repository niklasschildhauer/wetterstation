import { Component, Input, OnInit } from '@angular/core';
import { WeatherData } from 'src/app/model/weather';
import { CardSize } from '../../ui-elements/card-element/card-element.component';

/**
 * Simple tile view 
 * 
 * This is a simple component which can be used to display a simple
 * value in form of a tile (widget).
 */
@Component({
  selector: 'app-simple-tile-view',
  templateUrl: './simple-tile-view.component.html',
  styleUrls: ['./simple-tile-view.component.scss']
})
export class SimpleTileViewComponent implements OnInit {
  @Input() value: string = "";
  @Input() title: string = "";
  @Input() subtitle: string = "";
  cardSizeType = CardSize;

  constructor() { }

  ngOnInit(): void { }
}
