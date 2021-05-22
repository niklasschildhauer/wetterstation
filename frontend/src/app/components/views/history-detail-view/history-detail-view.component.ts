import { Component, OnInit } from '@angular/core';
import { GraphDataSet, WeatherHistoryData } from 'src/app/model/weather';
import { HistoryTileService } from 'src/app/services/history-tile.service';
import { WeatherDataService } from 'src/app/services/weather-data.service';
import { HistoryGraphType } from '../history-tile-view/history-tile-view.component';

@Component({
  selector: 'app-history-detail-view',
  templateUrl: './history-detail-view.component.html',
  styleUrls: ['./history-detail-view.component.scss']
})
export class HistoryDetailViewComponent implements OnInit {
  private _weatherHistory?: WeatherHistoryData
  dataSet?: GraphDataSet[] // FIXME: NAMING überall??
 
  set index(value: number) {
    this._index = value;
    if(this.dataSet && !(this.dataSet.length > value + 1)) {
      this.weatherDataService.loadMoreHistoryData().subscribe(data => {
        this.reload();
      });
    }
  }
  get index() {
    return this._index;
  }
  _index = 0;
  graphType = HistoryGraphType
  
  constructor(private historyTileService: HistoryTileService,
    private weatherDataService: WeatherDataService) { }

  ngOnInit(): void {
    this.loadWeatherHistoryData() 
  }

  loadWeatherHistoryData(): void {
    this.weatherDataService.getHistoryData().subscribe(data => {
      this._weatherHistory = data
      this.reload();
    });
  }

  reload() {
    if(this._weatherHistory)
    this.dataSet = this.historyTileService.getHistoryDataSetDaysPerWeekFrom(this._weatherHistory);
  }

  forward(): void {
    if(this.isForwardPossible()) {
     this.index = this.index + 1;
    }
  }

  isForwardPossible(): boolean {
    if(this.dataSet && this.dataSet.length > this.index + 1)  {
      return true
    }
    return false;
  }

  back(): void {
    if(this.isBackPossible()) {
      this.index = this.index - 1;
    } 
  }

  isBackPossible(): boolean {
    if(this.index > 0) {
      return true
    }
    return false;
  }

  getAverageTempString(): string {
    if(this.dataSet){
      return this.dataSet[this.index].temperatureAverage + "°C"
    }
    return ""
  }
  getAverageHumidityString(): string {
    if(this.dataSet){
      return this.dataSet[this.index].humidityAverage + "%"
    }
    return ""
  }
}

enum TimeInterval {
  day,
  week,
  month,
  year
}
