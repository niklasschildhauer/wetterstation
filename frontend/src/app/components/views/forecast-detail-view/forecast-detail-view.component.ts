import { Component, OnInit } from '@angular/core';
import { WeatherForecastData } from 'src/app/model/weather';
import { TileService } from 'src/app/services/tile.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-forecast-detail-view',
  templateUrl: './forecast-detail-view.component.html',
  styleUrls: ['./forecast-detail-view.component.scss']
})
export class ForecastDetailViewComponent implements OnInit {
  forecast?: WeatherForecastData;
  constructor(private tileService: TileService) { }

  ngOnInit(): void {
    this.loadForecastData();
  }

  loadForecastData() {
    this.tileService.getForecastData()
                        .subscribe(data => this.forecast = data);
  }
}
