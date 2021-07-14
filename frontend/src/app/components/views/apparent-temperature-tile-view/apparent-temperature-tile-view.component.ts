import { Component, Input, OnInit } from '@angular/core';
import { OutdoorWeatherData, WeatherData } from 'src/app/model/weather';
import { CardSize } from '../../ui-elements/card-element/card-element.component';

/**
 * Apparent temperature tile view component
 * 
 * This component displays in form of a tile (widget) the apparent 
 * temperature information. It takes an object of the type
 * WeatherData as information source. Itself has no connection to any
 * service. It uses the card-view-element to define the layout.
 */
@Component({
  selector: 'app-apparent-temperature-tile-view',
  templateUrl: './apparent-temperature-tile-view.component.html',
  styleUrls: ['./apparent-temperature-tile-view.component.scss']
})
export class ApparentTemperatureTileViewComponent implements OnInit {
  @Input() pressable: boolean = false;
  @Input() hideSubtitle = false;
  @Input()
  set data(data: WeatherData) {
    let outdoorWeatherData = data as OutdoorWeatherData
    this._apparentTemperature = outdoorWeatherData.apparentTemperature;
  }
  _apparentTemperature?: number;
  cardSizeType = CardSize;

  constructor() { }

  ngOnInit(): void {
  }

}
