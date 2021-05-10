import { Component, OnInit, Input } from '@angular/core';
import { WeatherGraphDataSet, WeatherData, GraphDataPoints } from 'src/app/model/weather';

@Component({
  selector: 'app-history-tile-view',
  templateUrl: './history-tile-view.component.html',
  styleUrls: ['./history-tile-view.component.scss']
})
export class HistoryTileViewComponent implements OnInit {
  @Input() pressable: boolean = false;
  @Input() graphType: HistoryGraphType = HistoryGraphType.temperature
  @Input()
  set data(data: WeatherData) {
    this._dataSet = data as WeatherGraphDataSet;
  }
  _dataSet?: WeatherGraphDataSet;

  private temperatureColorScheme = {
    domain: ['#E44A4A']
  };

  private humidityColorScheme = {
    domain: ['#335BF0']
  };

  constructor() { 
  }

  ngOnInit(): void {  }

  getDataPoint(): GraphDataPoints[] | undefined{
    switch (this.graphType) {
      case HistoryGraphType.temperature: {
        return this._dataSet?.temperatureDataPoints
      }
      case HistoryGraphType.humidity: {
        return this._dataSet?.humidityDataPoints
      }
    }
  }

  getColorScheme(){
    switch (this.graphType) {
      case HistoryGraphType.temperature: {
        return this.temperatureColorScheme
      }
      case HistoryGraphType.humidity: {
        return this.humidityColorScheme
      }
    }
  }

}

export enum HistoryGraphType {
  temperature,
  humidity
}

