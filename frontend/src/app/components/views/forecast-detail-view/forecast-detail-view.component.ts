import { Component, OnInit } from '@angular/core';
import { WeatherForecastData } from 'src/app/model/weather';
import { TextService } from 'src/app/services/text.service';
import { WeatherDataService } from 'src/app/services/weather-data.service';

@Component({
  selector: 'app-forecast-detail-view',
  templateUrl: './forecast-detail-view.component.html',
  styleUrls: ['./forecast-detail-view.component.scss']
})
export class ForecastDetailViewComponent implements OnInit {
  forecast?: WeatherForecastData;
  ttsTextGeneratorFunction = () => this.textService.createForecastText(this.forecast)

  constructor(private weatherDataService: WeatherDataService,
    private textService: TextService) { }

  ngOnInit(): void {
    this.loadForecastData();
  }

  loadForecastData() {
    this.weatherDataService.getForecastData()
                        .subscribe(data => this.forecast = data);
  }
}
