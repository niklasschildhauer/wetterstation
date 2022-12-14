import { Component, Input, OnInit } from '@angular/core';
import { OutdoorWeatherData, PollenData, WeatherData } from 'src/app/model/weather';
import { CardSize } from '../../ui-elements/card-element/card-element.component';

/**
 * Humidity tile view component
 * 
 * This component displays in form of a tile (widget) the humidity 
 * information. It takes an object of the type WeatherData as 
 * information source. Itself has no connection to any
 * service. It uses the card-view-element to define the layout.
 */
@Component({
  selector: 'app-humidity-tile-view',
  templateUrl: './humidity-tile-view.component.html',
  styleUrls: ['./humidity-tile-view.component.scss']
})
export class HumidityTileViewComponent implements OnInit {
  @Input() pressable: boolean = false;
  @Input() hideSubtitle: boolean = false;
  @Input()
  set data(data: WeatherData) {
    let outdoorWeatherData = data as OutdoorWeatherData
    this._humidity = outdoorWeatherData.humidity;
  }
  _humidity?: number;
  cardSizeType = CardSize;

  constructor() { }

  ngOnInit(): void {
  }

}
