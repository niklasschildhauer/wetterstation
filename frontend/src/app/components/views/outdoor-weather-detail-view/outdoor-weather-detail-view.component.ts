import { BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { OutdoorWeatherData } from 'src/app/model/weather';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-outdoor-weather-detail-view',
  templateUrl: './outdoor-weather-detail-view.component.html',
  styleUrls: ['./outdoor-weather-detail-view.component.scss']
})
export class OutdoorWeatherDetailViewComponent implements OnInit {
  desktop: boolean = false;
  outdoorWeather?: OutdoorWeatherData;

  constructor(private breakpointObserver: BreakpointObserver,
    private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.desktopBreakpointObserver();
    this.loadOutdoorWeatherData();
  }

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

  private loadOutdoorWeatherData() {
    this.weatherService.getOutdoorWeather().subscribe(data => this.outdoorWeather = data);
  }

}
