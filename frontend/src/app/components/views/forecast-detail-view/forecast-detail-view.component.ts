import { Component, OnInit } from '@angular/core';
import { WeatherForecastData } from 'src/app/model/weather';
import { WeatherDataService } from 'src/app/services/weather-data.service';

@Component({
  selector: 'app-forecast-detail-view',
  templateUrl: './forecast-detail-view.component.html',
  styleUrls: ['./forecast-detail-view.component.scss']
})
export class ForecastDetailViewComponent implements OnInit {
  forecast?: WeatherForecastData;
  constructor(private weatherDataService: WeatherDataService) { }

  ngOnInit(): void {
    this.loadForecastData();
  }

  loadForecastData() {
    this.weatherDataService.getForecastData()
                        .subscribe(data => this.forecast = data);
  }
}
