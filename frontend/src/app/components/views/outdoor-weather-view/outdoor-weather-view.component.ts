import { Component, OnInit } from '@angular/core';
import { OutdoorWeatherData } from 'src/app/model/weather';
import { WeatherService } from '../../../services/weather.service'

@Component({
  selector: 'app-outdoor-weather-view',
  templateUrl: './outdoor-weather-view.component.html',
  styleUrls: ['./outdoor-weather-view.component.scss']
})
export class OutdoorWeatherViewComponent implements OnInit {
  outdoorWeather?: OutdoorWeatherData;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getOutdoorWeather();
  }

  getOutdoorWeather(): void {
    this.weatherService.getOutdoorWeather()
      .subscribe(outdoorWeather => { 
        this.outdoorWeather = outdoorWeather 
        console.log("test24");
      });
  }

  changeTemp(): void {
    this.weatherService.changeTemp();
  }

}
