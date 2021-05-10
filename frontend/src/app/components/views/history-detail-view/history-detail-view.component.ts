import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { WeatherGraphDataSet, WeatherHistoryData } from 'src/app/model/weather';
import { HistoryTileService } from 'src/app/services/history-tile.service';
import { WeatherService } from 'src/app/services/weather.service';
import { HistoryGraphType } from '../history-tile-view/history-tile-view.component';

@Component({
  selector: 'app-history-detail-view',
  templateUrl: './history-detail-view.component.html',
  styleUrls: ['./history-detail-view.component.scss']
})
export class HistoryDetailViewComponent implements OnInit {
  private _weatherHistory?: WeatherHistoryData
  graphType = HistoryGraphType
  _dataSet?: WeatherGraphDataSet[] // FIXME: NAMING überall??
  _index = 0;

  constructor(private historyTileService: HistoryTileService,
    private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.loadWeatherHistoryData() 
  }

  loadWeatherHistoryData() {
    this.weatherService.getHistoryData().subscribe(data => {
      this._weatherHistory = data
      this._dataSet = this.historyTileService.getHistoryDataSetHoursPerDayFrom(this._weatherHistory);
    });
  }

  forward() {
    if(this._dataSet && this._dataSet.length > this._index + 1) {
     this._index = this._index + 1;
    }
  }

  back() {
    if(this._index > 0) {
      this._index = this._index - 1;
    } 
  }


}
