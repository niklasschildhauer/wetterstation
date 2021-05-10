import { Injectable } from '@angular/core';
import { GraphDataPoints, WeatherGraphDataSet, WeatherHistoryData } from '../model/weather';

@Injectable({
  providedIn: 'root'
})
export class HistoryTileService {
  constructor() { 
  }

  // FIXME: Horrible unreadable code LOL
  getHistoryDataSetHoursPerDayFrom(weatherHistoryData: WeatherHistoryData): WeatherGraphDataSet[] {
    var dataSet = []
    if (weatherHistoryData 
        && weatherHistoryData.datapoints.length > 0) {
      var data = weatherHistoryData;

      data.datapoints.sort((a, b) => {
        return b.timestamp.getTime() - a.timestamp.getTime()
      });

      dataSet = []
      var temperatureDataPoints: GraphDataPoints[]  = []; 
      var humidityDataPoints : GraphDataPoints[] = [];
      var lastDate: Date = data.datapoints[0].timestamp;

      for (let item of data.datapoints) {
        if(lastDate.getDate() > item.timestamp.getDate()) {
          dataSet.push(this.createWeatherGraphDataSet(temperatureDataPoints, humidityDataPoints, lastDate.toLocaleDateString() + ""));
          temperatureDataPoints = [];
          humidityDataPoints = [];
        }
        lastDate = item.timestamp;
        let name = item.timestamp.getHours() + " Uhr";
        let temperature = item.temperature;
        let humidity = item.humidity;
        temperatureDataPoints.push({
          name: name,
          value: temperature,
        }) 
        humidityDataPoints.push({
          name: name,
          value: humidity,
        }) 
      }
      dataSet.push(this.createWeatherGraphDataSet(temperatureDataPoints, humidityDataPoints, lastDate.toLocaleDateString() + ""));
    }
    return dataSet;
  }

  private createWeatherGraphDataSet(temperatureData: GraphDataPoints[], humidityData: GraphDataPoints[],label: string){
    let tempSum = temperatureData.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue.value;
    }, 0)
    let humiditySum = humidityData.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue.value;
    }, 0)

    let tempAverage = tempSum / temperatureData.length
    let humidityAverage = humiditySum / humidityData.length

    return {
      temperatureDataPoints: temperatureData,
      humidityDataPoints: humidityData,
      label: label,
      temperatureAverage: tempAverage,
      humidityAverage: humidityAverage,
    }
  }
}
