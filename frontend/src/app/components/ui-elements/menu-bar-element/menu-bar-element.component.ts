import { Component, Input, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-menu-bar-element',
  templateUrl: './menu-bar-element.component.html',
  styleUrls: ['./menu-bar-element.component.scss']
})
export class MenuBarElementComponent implements OnInit {
  locationLabel?: string;
  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getLocation();
  }

  getLocation(): void {
    this.weatherService.getOutdoorWeather()
                        .subscribe(data => this.locationLabel = data.location);
  }
}
