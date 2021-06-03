import { Component, Input, OnInit } from '@angular/core';
import { OutdoorWeatherData } from 'src/app/model/weather';
import { UserContextService } from 'src/app/services/user-context.service';
import { WeatherDataService } from 'src/app/services/weather-data.service';

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

  loadReduceMotionValue() {
    this.userContextService.getUserContextSubject()
                          .subscribe(data => {
                              this.reduceMotion = data.reduceMotion;
                            });
  }

  getLocation(): void {
    this.weatherDataService.getOutdoorWeatherDataSubject()
                        .subscribe(data => {
                          this.locationLabel = data?.location
                        });
  }

  reloadData() {
    this.weatherDataService.reloadData();
  }
}
