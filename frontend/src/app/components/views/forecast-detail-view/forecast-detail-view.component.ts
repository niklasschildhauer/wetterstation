import { Component, OnInit } from '@angular/core';
import { WeatherForecastData } from 'src/app/model/weather';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-forecast-detail-view',
  templateUrl: './forecast-detail-view.component.html',
  styleUrls: ['./forecast-detail-view.component.scss']
})
export class ForecastDetailViewComponent implements OnInit {
  forecast?: WeatherForecastData;
  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.loadForecastData();
  }

  loadForecastData() {
    this.weatherService.getForecastData()
                        .subscribe(data => this.forecast = data);
  }
}
