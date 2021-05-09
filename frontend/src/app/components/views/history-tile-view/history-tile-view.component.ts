import { Component, OnInit, Input } from '@angular/core';
import { OutdoorWeatherData, WeatherData } from 'src/app/model/weather';

@Component({
  selector: 'app-history-tile-view',
  templateUrl: './history-tile-view.component.html',
  styleUrls: ['./history-tile-view.component.scss']
})
export class HistoryTileViewComponent implements OnInit {
  @Input() pressable: boolean = false;
  @Input()
  set data(data: WeatherData) {
    this._history = data as OutdoorWeatherData[];
  }
  _history?: OutdoorWeatherData[]

  constructor() { }

  ngOnInit(): void {  }
}
