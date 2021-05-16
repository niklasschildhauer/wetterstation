import { Component, OnInit, Input } from '@angular/core';
import { PollenData, WeatherData } from 'src/app/model/weather';
import { CardSize } from '../../ui-elements/card-element/card-element.component';

@Component({
  selector: 'app-pollenflug-small-tile',
  templateUrl: './pollenflug-small-tile.component.html',
  styleUrls: ['./pollenflug-small-tile.component.scss']
})
export class PollenflugSmallTileComponent implements OnInit {
  @Input() pressable: boolean = false;
  @Input()
  set data(data: WeatherData) {
    this._pollen = data as PollenData;
  }
  _pollen?: PollenData;
  cardSizeType = CardSize;

  constructor() { }

  ngOnInit(): void {
  }

}
