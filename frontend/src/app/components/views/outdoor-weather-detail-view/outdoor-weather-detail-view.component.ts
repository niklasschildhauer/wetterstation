import { BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { OutdoorWeatherData } from 'src/app/model/weather';
import { TextService } from 'src/app/services/text.service';
import { WeatherDataService } from 'src/app/services/weather-data.service';

/**
 * Outdoor weather detail view component
 * 
 * This component display the outdoor weather view data
 * and displays an information text. 
 */
@Component({
  selector: 'app-outdoor-weather-detail-view',
  templateUrl: './outdoor-weather-detail-view.component.html',
  styleUrls: ['./outdoor-weather-detail-view.component.scss']
})
export class OutdoorWeatherDetailViewComponent implements OnInit {
  desktop: boolean = false;
  outdoorWeather?: OutdoorWeatherData;
  /**
   * this function computes the to be read aloud text for the tts feature. 
   * This function is passed to the tts player element
   */
  ttsTextGeneratorFunction = () => this.textService.createOutdoorText(this.outdoorWeather)

  constructor(private breakpointObserver: BreakpointObserver,
    private weahterDataService: WeatherDataService,
    private textService: TextService) { }

  ngOnInit(): void {
    this.desktopBreakpointObserver();
    this.loadOutdoorWeatherData();
  }

  /**
   * Detects the display width. If it is a mobile device
   * it will display the OutdoorWeatherViewComponent otherwise
   * the component will be displayed by the app component. 
   */
  private desktopBreakpointObserver() {
    this.breakpointObserver
    .observe(['(min-width: 770px)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.desktop = true;
      } else {
        this.desktop = false;
      }
    });
  }

  /**
   * Subscribes to the outdoor weather data
   */
  private loadOutdoorWeatherData() {
    this.weahterDataService.getOutdoorWeatherDataSubject().subscribe(data => this.outdoorWeather = data);
  }

}
