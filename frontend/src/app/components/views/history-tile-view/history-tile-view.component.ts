import { Component, OnInit, Input } from '@angular/core';
import { WeatherData, WeatherHistoryData } from 'src/app/model/weather';
import { HistoryTileService, GraphDataSet, GraphDataPoints } from 'src/app/services/history-tile.service';

@Component({
  selector: 'app-history-tile-view',
  templateUrl: './history-tile-view.component.html',
  styleUrls: ['./history-tile-view.component.scss']
})
export class HistoryTileViewComponent implements OnInit {
  @Input() pressable: boolean = false;
  @Input()
  set data(data: WeatherData) {
    this._history = data as WeatherHistoryData;
    this.showHours();
  }
  _history?: WeatherHistoryData;
  _dataSet?: GraphDataSet[];
  _index: number = 0; 

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  showYAxisLabel = true;
  yAxisLabel = "Grad";

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(public historyService: HistoryTileService) { 
  }

  ngOnInit(): void {  }

  private showHours() {
    if (this._history 
        && this._history.datapoints.length > 0) {
      var data = this._history

      data.datapoints.sort((a, b) => {
        return b.timestamp.getTime() - a.timestamp.getTime()
      });

      this._dataSet = []
      var dataPoints: GraphDataPoints[]  = []; 
      var lastDate: Date = data.datapoints[0].timestamp;

      for (let item of data.datapoints) {
        if(lastDate.getDate() > item.timestamp.getDate()) {
          this._dataSet.push({
            dataPoints: dataPoints.reverse(),
            label: lastDate.toLocaleDateString() + ""
          });
          dataPoints = [];
        }
        lastDate = item.timestamp;
        dataPoints.push({
          name: item.timestamp.getHours() + " Uhr",
          value: item.temperature,
        }) 
      }
      this._dataSet.push({
        dataPoints: dataPoints.reverse(),
        label: lastDate.toLocaleDateString() + ""
      });
      console.log(this._dataSet)
    }
  }
}

