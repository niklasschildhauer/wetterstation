import { Component, OnInit } from '@angular/core';
import { WeatherForecastData } from 'src/app/model/weather';
import { TextService } from 'src/app/services/text.service';
import { WeatherDataService } from 'src/app/services/weather-data.service';

/**
 * Forecast detail view component
 * 
 * This component displays the forecast tile view component and
 * an information text about the forecast. It is also responsible
 * for the loading of the forecast data.
 */
@Component({
  selector: 'app-forecast-detail-view',
  templateUrl: './forecast-detail-view.component.html',
  styleUrls: ['./forecast-detail-view.component.scss']
})
export class ForecastDetailViewComponent implements OnInit {
  forecast?: WeatherForecastData;
  /**
   * this function computes the to be read aloud text for the tts feature. 
   * This function is passed to the tts player element
   */
  ttsTextGeneratorFunction = () => this.textService.createForecastText(this.forecast)

  constructor(private weatherDataService: WeatherDataService,
    private textService: TextService) { }

  ngOnInit(): void {
    this.loadForecastData();
  }

  /**
   * Subscribes the forecast data subject. Every time the data in the
   * service changes this function will be called. 
   */
  loadForecastData() {
    this.weatherDataService.getForecastDataSubject()
                        .subscribe(data => this.forecast = data);
  }
}
