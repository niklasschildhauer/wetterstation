import { Component, OnInit, Input } from '@angular/core';
import { Themes } from 'src/app/model/user-context';
import { GraphDataSet, WeatherData } from 'src/app/model/weather';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend,
  ApexTheme,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  theme: ApexTheme;
  animation: {
    enabled: boolean,
  }
};

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
      this.updateChartData(this.chartOptions, this._dataSet, this._graphType)
    }
  }
  _graphType: HistoryGraphType = HistoryGraphType.temperature
  @Input()
  set data(data: WeatherData) {
    this._dataSet = data as GraphDataSet;
    if(this._dataSet) {
      this.updateChartData(this.chartOptions, this._dataSet, this._graphType)
    }
  }
  _dataSet?: GraphDataSet;
  theme: Themes = Themes.Light;

  public chartOptions: ChartOptions = {
    series: [
      {
        data: []
      },
    ],
    xaxis: {
      categories: [],
    },
    yaxis: {
    },
    chart: {
      height: 350,
      type: "line",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: false
      }
    },
    colors: ["#77B6EA", "#545454"],
    dataLabels: {
      enabled: true
    },
    stroke: {
      curve: "smooth"
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5
      }
    },
    markers: {
      size: 1
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5
    },
    theme: {
      mode: 'dark', 
    },
    animation: {
      enabled: false,
    }
  };

  constructor() { 
    
  }

  ngOnInit(): void { 
    
  }
  
  updateChartData(chartOptions: ChartOptions, dataSet: GraphDataSet, graphType: HistoryGraphType) {
    let graphData
    switch (graphType) {
      case HistoryGraphType.temperature:
        graphData = dataSet.temperatureDataPoints
        break;
      case HistoryGraphType.humidity:
        graphData = dataSet.humidityDataPoints
        break;
    }
    chartOptions.series = [
      {
        data: graphData
      }
    ];
    chartOptions.xaxis = {
      categories: dataSet.xAxisLabel,
    }
  }

}

export enum HistoryGraphType {
  temperature,
  humidity
}

