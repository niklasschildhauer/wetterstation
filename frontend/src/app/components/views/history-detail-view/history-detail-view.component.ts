import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { GraphDataSet, WeatherHistoryData } from 'src/app/model/weather';
import { HistoryTileService } from 'src/app/services/history-tile.service';
import { TileService } from 'src/app/services/tile.service';
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
  _dataSet?: GraphDataSet[] // FIXME: NAMING überall??
  _index = 0;

  constructor(private historyTileService: HistoryTileService,
    private tileService: TileService) { }

  ngOnInit(): void {
    this.loadWeatherHistoryData() 
  }

  loadWeatherHistoryData(): void {
    this.tileService.getHistoryData().subscribe(data => {
      this._weatherHistory = data
      if(this._weatherHistory)
      this._dataSet = this.historyTileService.getHistoryDataSetHoursPerDayFrom(this._weatherHistory);
    });
  }

  forward(): void {
    if(this.isForwardPossible()) {
     this._index = this._index + 1;
    }
  }

  isForwardPossible(): boolean {
    if(this._dataSet && this._dataSet.length > this._index + 1)  {
      return true
    }
    return false;
  }

  back(): void {
    if(this.isBackPossible()) {
      this._index = this._index - 1;
    } 
  }

  isBackPossible(): boolean {
    if(this._index > 0) {
      return true
    }
    return false;
  }


}
