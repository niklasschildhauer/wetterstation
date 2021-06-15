import { Component, Input, OnInit } from '@angular/core';
import { Daytime, OutdoorWeatherData } from 'src/app/model/weather';
import { UserContextService } from 'src/app/services/user-context.service';
import { WeatherDataService } from 'src/app/services/weather-data.service';
import { Themes, UserContext } from 'src/app/model/user-context';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-outdoor-weather-view',
  templateUrl: './outdoor-weather-view.component.html',
  styleUrls: ['./outdoor-weather-view.component.scss']
})
export class OutdoorWeatherViewComponent implements OnInit {
  @Input() reduceMotion: boolean = false; 
  outdoorWeather?: OutdoorWeatherData;
  daytime: Daytime = Daytime.noon
  daytimeType = Daytime;
  showWeatherDescription: boolean = true;
  userContext?: UserContext;
  themeType = Themes;
  theme: Themes = Themes.Automatic;

  constructor(private userContextService: UserContextService,
              private weatherDataService: WeatherDataService,
              private imageService: ImageService) { }

  ngOnInit(): void {
    // this.loadOutdoorWeather();
    this.listenToScrollEvent();
    this.loadDaytime();
    this.loadUserContext();
    this.weatherDataService.getOutdoorWeatherDataSubject().subscribe(data => this.outdoorWeather = data);
  }

  loadUserContext() {
    this.userContextService.getUserContextSubject()
    .subscribe(data => {
      this.userContext = data;
      this.theme = data.theme;
    });
  }

  loadOutdoorWeather(): void {
    this.weatherDataService.getOutdoorWeatherDataSubject()
      .subscribe(outdoorWeather => { 
        this.outdoorWeather = outdoorWeather 
      });
  }

  loadDaytime(): void {
    this.daytime = Daytime.dawn
    // this.daytime = this.imageService.getDaytime()
  }

  getGradient(): { background: string, filter: string } {
    return this.imageService.getGradientStyleFor(this.outdoorWeather?.weather)
  }

  getWeatherImage(): string | undefined {
    return this.imageService.getWeatherIconString(this.outdoorWeather?.weather);
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
    if(this.outdoorWeather) {
      return "Heute ist es sonnig";
    } 
    return "";
  }
}
