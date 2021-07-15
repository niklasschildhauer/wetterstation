import { Component, Input, OnInit } from '@angular/core';
import { Daytime, OutdoorWeatherData } from 'src/app/model/weather';
import { UserContextService } from 'src/app/services/user-context.service';
import { WeatherDataService } from 'src/app/services/weather-data.service';
import { Themes, UserContext } from 'src/app/model/user-context';
import { ImageService } from 'src/app/services/image.service';
import { TextService } from 'src/app/services/text.service';

/**
 * Outdoor weather view component
 * 
 * Displays the most importatn information of the weather station.
 * These are the current temperature, the weather icon and the
 * weather description as a short string.
 */
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
              private imageService: ImageService,
              private textService: TextService) { }

  ngOnInit(): void {
    this.loadOutdoorWeather();
    this.listenToScrollEvent();
    this.loadUserContext();
  }

  /**
   * Subscribes to the user context subject
   */
  private loadUserContext() {
    this.userContextService.getUserContextSubject()
    .subscribe(data => {
      this.userContext = data;
      this.theme = data.theme;
    });
  }

  /**
   * Subscribes to the outdoor wather data subject.
   */
  private loadOutdoorWeather(): void {
    this.weatherDataService.getOutdoorWeatherDataSubject()
      .subscribe(outdoorWeather => { 
        this.outdoorWeather = outdoorWeather 
      });
  }

  /**
   * @returns the current gradient, based on the current time. This information
   * comes from the image service.
   */
  getGradient(): { background: string, filter: string } {
    return this.imageService.getGradientStyleFor(this.outdoorWeather?.weather)
  }

  /**
   * @returns the current weather image string.
   */
  getWeatherImage(): string | undefined {
    return this.imageService.getWeatherIconString(this.outdoorWeather?.weather);
  }

  /**
   * @returns the current weather description string.
   */
  getWeatherDescription(): string {
    if(this.outdoorWeather) {
      return this.textService.createWeatherText(this.outdoorWeather.weather);
    } 
    return "";
  }

  /**
   * Listens to the scroll event of the user by using the window
   * eventlistener. During scrolling the css variable scroll
   * changes the value, so in CSS code the animation can be applied.
   */
  private listenToScrollEvent() {
    window.addEventListener('scroll', () => {
      if(!this.reduceMotion) {
        let scrollValue = (window.pageYOffset) / 240; 
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
}
