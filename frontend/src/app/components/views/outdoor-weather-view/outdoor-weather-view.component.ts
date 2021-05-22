import { Component, Input, OnInit } from '@angular/core';
import { Daytime, OutdoorWeatherData } from 'src/app/model/weather';
import { WeatherAPIService } from '../../../services/weather-api.service'
import { UserContextService } from 'src/app/services/user-context.service';
import { WeatherDataService } from 'src/app/services/weather-data.service';

@Component({
  selector: 'app-outdoor-weather-view',
  templateUrl: './outdoor-weather-view.component.html',
  styleUrls: ['./outdoor-weather-view.component.scss']
})
export class OutdoorWeatherViewComponent implements OnInit {
  @Input() reduceMotion: boolean = false; // FIXME: wieso Input?
  outdoorWeather?: OutdoorWeatherData;
  daytime: Daytime = Daytime.noon
  daytimeType = Daytime;
  showWeatherDescription: boolean = true;

  constructor(private weatherService: WeatherAPIService,
    private userContextService: UserContextService,
    private weatherDataService: WeatherDataService) { }

  ngOnInit(): void {
    // this.loadOutdoorWeather();
    this.listenToScrollEvent();
    this.loadDaytime();
    this.weatherDataService.getOutdoorWeatherData().subscribe(data => this.outdoorWeather = data);
  }

  loadReduceMotionValue() {
    this.userContextService.getUserContext()
    .subscribe(data => {
      let reduceMotionValue = data.reduceMotion;
      this.reduceMotion = reduceMotionValue
    });
  }

  loadOutdoorWeather(): void {
    this.weatherService.getOutdoorWeather()
      .subscribe(outdoorWeather => { 
        this.outdoorWeather = outdoorWeather 
        console.log("test24");
      });
  }

  loadDaytime(): void {
    this.daytime = this.weatherService.getDaytime()
  }

  // changes the css --scroll variable everytime the user scrolls. Main part of the animation
  listenToScrollEvent() {
    window.addEventListener('scroll', () => {
      if(!this.reduceMotion) {
        let scrollValue = (window.pageYOffset) / 240; // FIXME: Wert berechnen für angepasste schriftgröße
        if(scrollValue < 0) {
          scrollValue = 0;
        }
        if(scrollValue > 1) {
          scrollValue = 1;
        }
        scrollValue > 0.2 ?
          this.showWeatherDescription = false 
          :
          this.showWeatherDescription = true;
        document.body.style.setProperty('--scroll', "" + scrollValue );
      } else {
        document.body.style.setProperty('--scroll', "" + 0 );
      }
    }, false);
  }

 
  getWeatherDescription(): string {
    return "Heute ist es sonnig";
  }
}
