import { Injectable } from '@angular/core';
import { GraphDataSet, WeatherHistoryData } from '../model/weather';

@Injectable({
  providedIn: 'root'
})
export class HistoryTileService {
  constructor() { 
  }

  // FIXME: Horrible unreadable code LOL
  getHistoryDataSetHoursPerDayFrom(weatherHistoryData: WeatherHistoryData): GraphDataSet[] {
    var dataSet = []
    if (weatherHistoryData 
        && weatherHistoryData.datapoints.length > 0) {
      var data = weatherHistoryData;

      data.datapoints.sort((a, b) => {
        return b.timestamp.getTime() - a.timestamp.getTime()
      });

      dataSet = []
      var temperatureDataPoints: number[]  = []; 
      var humidityDataPoints : number[] = [];
      var xAxisLabels: string[] = [];

      var lastDate: Date = data.datapoints[0].timestamp;

      for (let item of data.datapoints) {
        if(lastDate.getDate() > item.timestamp.getDate()) {
          dataSet.push(this.createWeatherGraphDataSet(temperatureDataPoints, humidityDataPoints, xAxisLabels, lastDate.toLocaleDateString() + ""));
          temperatureDataPoints = [];
          humidityDataPoints = [];
          xAxisLabels = [];
        }
        lastDate = item.timestamp;
        let name = item.timestamp.getHours() + " Uhr";
        let temperature = item.temperature;
        let humidity = item.humidity;
        temperatureDataPoints.push(temperature) 
        humidityDataPoints.push(humidity) 
        xAxisLabels.push(name);
      }
      dataSet.push(this.createWeatherGraphDataSet(temperatureDataPoints, humidityDataPoints, xAxisLabels, lastDate.toLocaleDateString() + ""));
    }
    return dataSet;
  }

  private createWeatherGraphDataSet(temperatureData: number[], humidityData: number[], xAxisLabels: string[], label: string): GraphDataSet{
    let tempSum = temperatureData.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0)
    let humiditySum = humidityData.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0)

    let tempAverage = tempSum / temperatureData.length
    let humidityAverage = humiditySum / humidityData.length

    return {
      temperatureDataPoints: temperatureData,
      humidityDataPoints: humidityData,
      xAxisLabel: xAxisLabels,
      label: label,
      temperatureAverage: tempAverage,
      humidityAverage: humidityAverage,
    }
  }
}
