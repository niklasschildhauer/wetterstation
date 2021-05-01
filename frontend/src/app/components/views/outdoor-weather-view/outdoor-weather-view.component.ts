import { Component, OnInit } from '@angular/core';
import { OutdoorWeatherData } from 'src/app/model/weather';
import { WeatherService } from '../../../services/weather.service'
import { WeatherType } from '../../../model/weather';

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
    this.listenToScrollEvent();
  }

  // changes the css --scroll variable everytime the user scrolls
  listenToScrollEvent() {
    window.addEventListener('scroll', () => {
      let scrollValue = (window.pageYOffset) / 240; // FIXME: Wert berechnen für angepasste schriftgröße
      if(scrollValue < 0) {
        scrollValue = 0;
      }
      if(scrollValue > 1) {
        scrollValue = 1;
      }
      console.log("scrollValue:" + scrollValue);
      document.body.style.setProperty('--scroll', "" + scrollValue );
    }, false);
  }

  getOutdoorWeather(): void {
    this.weatherService.getOutdoorWeather()
      .subscribe(outdoorWeather => { 
        this.outdoorWeather = outdoorWeather 
        console.log("test24");
      });
  }

  getWeatherDescription(): string {
    return "Heute ist es sonnig";
  }
}
