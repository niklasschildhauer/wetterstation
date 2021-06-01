import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  outdoorWeatherData?: OutdoorWeatherData
  reduceMotion: boolean = false; // We need this value, because the menu bar changes the font color, based on it

  constructor(private weatherDataService: WeatherDataService,
    private userContextService: UserContextService,
    private router: Router) { }

  ngOnInit(): void {
    this.getLocation();
    this.loadReduceMotionValue();
  }

  loadReduceMotionValue() {
    this.userContextService.getUserContext()
    .subscribe(data => {
      let reduceMotionValue = data.reduceMotion;
      this.reduceMotion = reduceMotionValue
    });
  }

  getLocation(): void {
    this.weatherDataService.getOutdoorWeatherData()
                        .subscribe(data => {
                          this.outdoorWeatherData = data
                        });
  }

  reloadData() {
    this.weatherDataService.reloadData();
  }
}
