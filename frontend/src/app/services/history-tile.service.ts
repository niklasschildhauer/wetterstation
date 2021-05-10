import { Injectable } from '@angular/core';
import { WeatherHistoryData } from '../model/weather';

@Injectable({
  providedIn: 'root'
})
export class HistoryTileService {
  _history?: WeatherHistoryData;
  _dataSet?: GraphDataSet[];
  _index: number = 1; 

  constructor() { }
}

export interface GraphDataPoints {
  name: string;
  value: number;
}

export interface GraphDataSet {
  dataPoints: GraphDataPoints[];
  label: string
}