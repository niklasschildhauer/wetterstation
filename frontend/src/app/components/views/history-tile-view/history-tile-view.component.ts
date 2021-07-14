import { Component, OnInit, Input } from '@angular/core';
import { Themes } from 'src/app/model/user-context';
import { GraphDataSet, WeatherData } from 'src/app/model/weather';
import { ChartLabel, ChartColor, ChartDataset } from '@rinminase/ng-charts';

/**
 * History tile view component
 * 
 * This component displays in form of a tile (widget) the history data 
 * as a line chart. It takes an object of the type GraphDataSet as information source. 
 * Itself has no connection to any data service. 
 * It uses the card-view-element to define the layout.
 */
@Component({
  selector: 'app-history-tile-view',
  templateUrl: './history-tile-view.component.html',
  styleUrls: ['./history-tile-view.component.scss']
})
export class HistoryTileViewComponent implements OnInit {
  @Input() pressable: boolean = false;
  @Input() title?: string;
  @Input() 
  set graphType(type: HistoryGraphType) {
    this._graphType = type;
    if(this._dataSet) {
      this.updateChartData(this.chartData, this.chartColors, this._dataSet, this._graphType)
    }
  }
  _graphType: HistoryGraphType = HistoryGraphType.temperature
  @Input()
  set data(data: WeatherData) {
    this._dataSet = data as GraphDataSet;
    if(this._dataSet) {
      this.updateChartData(this.chartData, this.chartColors, this._dataSet, this._graphType)
    }
  }
  _dataSet?: GraphDataSet;
  theme: Themes = Themes.Light;


  // Chart data
  chartData: ChartDataset[] = [
    { data: [], label: '' },
  ];
  chartLabels: ChartLabel[] = [];
  chartOptions = {
    responsive: true,
  };
  chartColors: ChartColor = [];
  chartLegend = false;
  chartPlugins = [];

  constructor() { }

  ngOnInit(): void { }
  
  /**
   * This function converts the GraphDataSet to the ChartDataset and Chartcolor, which 
   * are needed by the graph library. @Carina
   * 
   * @param chartDataset 
   * @param chartColors 
   * @param dataSet 
   * @param graphType 
   */
  updateChartData(chartDataset: ChartDataset[], chartColors: ChartColor, dataSet: GraphDataSet, graphType: HistoryGraphType) {
    switch (graphType) {
      case HistoryGraphType.temperature:
        chartDataset[0].data = dataSet.temperatureDataPoints
        chartDataset[0].label = "°C"
        chartColors[0] = {
          borderColor: 'red',
          backgroundColor: 'rgba(255,0,0,0.1)',
        };
        break;
      case HistoryGraphType.humidity:
        chartDataset[0].data = dataSet.humidityDataPoints
        chartDataset[0].label = "%"
        chartColors[0] = {
          borderColor: 'blue',
          backgroundColor: 'rgba(0,0,255,0.1)',
        };
        break;
    }
    this.chartLabels = dataSet.xAxisLabel

  }

}

export enum HistoryGraphType {
  temperature,
  humidity
}

