import { Component, Input, OnInit } from '@angular/core';
import { UserContextService } from 'src/app/services/user-context.service';
import { WeatherDataService } from 'src/app/services/weather-data.service';

/**
 * Menu bar element
 * 
 * Menu bar navigation component which is displayed in the
 * dashboard screen.
 */
@Component({
  selector: 'app-menu-bar-element',
  templateUrl: './menu-bar-element.component.html',
  styleUrls: ['./menu-bar-element.component.scss']
})
export class MenuBarElementComponent implements OnInit {
  locationLabel?: string;
  reduceMotion: boolean = false; // We need this value, because the menu bar changes the font color, based on it

  constructor(private weatherDataService: WeatherDataService,
              private userContextService: UserContextService) { }

  ngOnInit(): void {
    this.getLocation();
    this.loadReduceMotionValue();
  }

  /**
   * Subscribes to the reduce motion value
   */
  loadReduceMotionValue() {
    this.userContextService.getUserContextSubject()
                          .subscribe(data => {
                              this.reduceMotion = data.reduceMotion;
                            });
  }

  /**
   * Subscribes to outdoor weather subject to load the location stirng
   */
  getLocation(): void {
    this.weatherDataService.getOutdoorWeatherDataSubject()
                        .subscribe(data => {
                          if(data)
                          this.locationLabel = data.location + ', ' + data.postCode;
                        });
  }
  
  /**
   * Calls the reload function of the weather data service.
   */
  reloadData() {
    this.weatherDataService.reloadData();
  }
}
