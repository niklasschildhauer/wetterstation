import { Component, Input, OnInit } from '@angular/core';
import { UserContextService } from 'src/app/services/user-context.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-menu-bar-element',
  templateUrl: './menu-bar-element.component.html',
  styleUrls: ['./menu-bar-element.component.scss']
})
export class MenuBarElementComponent implements OnInit {
  locationLabel?: string;
  reduceMotion: boolean = false; // We need this value, because the menu bar changes the font color, based on it

  constructor(private weatherService: WeatherService,
    private userContextService: UserContextService) { }

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
    this.weatherService.getOutdoorWeather()
                        .subscribe(data => this.locationLabel = data.location);
  }
}
