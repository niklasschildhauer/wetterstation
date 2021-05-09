import { Component, OnInit, Input } from '@angular/core';
import { WeatherData, WeatherForecastData } from 'src/app/model/weather';

@Component({
  selector: 'app-forecast-tile-view',
  templateUrl: './forecast-tile-view.component.html',
  styleUrls: ['./forecast-tile-view.component.scss']
})
export class ForecastTileViewComponent implements OnInit {
  @Input() pressable: boolean = false;
  @Input()
  set data(data: WeatherData) {
    this._forecast = data as WeatherForecastData;
  }
  _forecast?: WeatherForecastData
  constructor() { }

  ngOnInit(): void {
  }

}
