import { Component, OnInit } from '@angular/core';
import { GraphDataSet, WeatherHistoryData } from 'src/app/model/weather';
import { HistoryTileService } from 'src/app/services/history-tile.service';
import { WeatherDataService } from 'src/app/services/weather-data.service';
import { HistoryGraphType } from '../history-tile-view/history-tile-view.component';

/**
 * History detail view component
 * 
 * This component displays the history data in form of a line chart.
 * It displays two line charts. One for the temperature history and one
 * for the humidity history. For this the history tile view is used twice.
 * It is also responsible for the loading of the history data.
 * This component uses the history service to compute the graph data.
 * In this way the data can be filterd by day or month.
 */
@Component({
  selector: 'app-history-detail-view',
  templateUrl: './history-detail-view.component.html',
  styleUrls: ['./history-detail-view.component.scss']
})
export class HistoryDetailViewComponent implements OnInit {
  private _weatherHistory?: WeatherHistoryData
  dataSet?: GraphDataSet[] 
  /**
   * Setting the index  checks if the end of the array is
   * reached. In this the case, the weather data 
   * service is told to load more data if possible.
   */
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
  selectedTimeInterval = TimeInterval.day;
  timeIntervalType = TimeInterval

  constructor(private historyTileService: HistoryTileService,
    private weatherDataService: WeatherDataService) { }

  ngOnInit(): void {
    this.loadWeatherHistoryData() 
  }

  /**
   * Subscribes the history data subject from the weather service.
   */
  private loadWeatherHistoryData(): void {
    this.weatherDataService.getHistoryDataSubject().subscribe(data => {
      this._weatherHistory = data
      this.reload();
    });
  }

  /**
   * Is called after the interval was changed. In this way the index is reset
   * to the inital value
   */
  selectInterval() {
    this.reload();
    this.index = 0;
  }

  /**
   * This functio uses the history service to compute 
   * the graph data by passing the weather history property.  
   */
  private reload() {
    if(this._weatherHistory) {
      if(this.selectedTimeInterval == TimeInterval.day) {
        this.dataSet = this.historyTileService.getHistoryDataSetHoursPerDayFrom(this._weatherHistory);
        return
      }
      if(this.selectedTimeInterval == TimeInterval.week) {
        this.dataSet = this.historyTileService.getHistoryDataSetDaysPerWeekFrom(this._weatherHistory);
        return
      }
      if(this.selectedTimeInterval == TimeInterval.month) {
        this.dataSet = this.historyTileService.getHistoryDataSetHoursPerDayFrom(this._weatherHistory);
        return
      }
    }
  }

  /**
   * Increases the index
   */
  forward(): void {
    if(this.isForwardPossible()) {
     this.index = this.index + 1;
    }
  }

  /** 
   * @returns true if more data is there to show
   */
  isForwardPossible(): boolean {
    if(this.dataSet && this.dataSet.length > this.index + 1)  {
      return true
    }
    return false;
  }

  /**
   * Reduces the index
   */
  back(): void {
    if(this.isBackPossible()) {
      this.index = this.index - 1;
    } 
  }

  /**
   * @returns true if the index is not smaller than 0. 
   */
  isBackPossible(): boolean {
    if(this.index > 0) {
      return true
    }
    return false;
  }

  /**
   * @returns the average temperature string
   */
  getAverageTempString(): string {
    if(this.dataSet){
      return this.dataSet[this.index].temperatureAverage + "°C"
    }
    return ""
  }

  /**
   * @returns the average humidity string
   */
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
}
