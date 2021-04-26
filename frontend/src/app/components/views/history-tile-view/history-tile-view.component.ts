import { Component, OnInit } from '@angular/core';
import { OutdoorWeather } from 'src/app/model/weather';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-history-tile-view',
  templateUrl: './history-tile-view.component.html',
  styleUrls: ['./history-tile-view.component.scss']
})
export class HistoryTileViewComponent implements OnInit {
  weather?: OutdoorWeather
  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getWeatherData();
  }

  getWeatherData() {
    this.weatherService.getOutdoorWeather().subscribe(data => this.weather = data);
  }

}
