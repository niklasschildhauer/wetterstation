import { Injectable } from '@angular/core';
import { GraphDataSet, OutdoorWeatherData, WeatherHistoryData } from '../model/weather';

const DAYS = ['So','Mo','Di','Mi','Do','Fr','Sa'];
const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

@Injectable({
  providedIn: 'root'
})
export class HistoryTileService {
  constructor() { 
  }

  private getHourString(hour: number): string {
    return hour + " Uhr";
  }

  private getWeekStringFromWeekNumber(week: number): string {
    return "Kalenderwoche " + week;
  }

  private getWeekDayStringFromDate(date: Date): string {
    return DAYS[date.getDay()]
  }

  private getDateStringFromDate(date: Date): string {
    let day = date.getDate();
    let month = MONTHS[date.getMonth()];
    let year = date.getFullYear();

    return DAYS[date.getDay()] + ", " + day + " " + month + " " + year
  }

  getHistoryDataSetDaysPerWeekFrom(weatherHistoryData: WeatherHistoryData): GraphDataSet[] {
    if (weatherHistoryData.datapoints.length > 0) {
      var dataSet: GraphDataSet[] = []
      var dataPoints = weatherHistoryData.datapoints

      dataPoints.sort((a, b) => {
        return b.timestamp.getTime() - a.timestamp.getTime()
      });

      var lastDate: Date = dataPoints[0].timestamp;
      var lastWeek: number = this.getWeekNumber(lastDate);
      var label: string = this.getWeekStringFromWeekNumber(lastWeek);
      var temperatureDataPoints: number[]  = []; 
      var humidityDataPoints : number[] = [];
      var xAxisLabels: string[] = [];
      var temperatureSumOfWeek = 0
      var humiditySumOfWeek = 0
      let index = 0

      for (let item of dataPoints) {
        if(lastDate.getDate() > item.timestamp.getDate()) {
          let averageTemperature = temperatureSumOfWeek / index;
          let averageHumidity = humiditySumOfWeek / index;
          temperatureDataPoints.push(Math.round(averageTemperature));
          humidityDataPoints.push(Math.round(averageHumidity));
          xAxisLabels.push(this.getWeekDayStringFromDate(lastDate))
          index = 0;
          temperatureSumOfWeek = 0;
          humiditySumOfWeek = 0;
          lastDate = item.timestamp
          if(lastWeek > this.getWeekNumber(item.timestamp)) {
            dataSet.push(this.createWeatherGraphDataSet(temperatureDataPoints, humidityDataPoints, xAxisLabels, label));
            temperatureDataPoints = [];
            humidityDataPoints = [];
            xAxisLabels = [];
            lastWeek = this.getWeekNumber(lastDate);
            label = this.getWeekStringFromWeekNumber(lastWeek);
          }
        }
        index = index + 1;
        temperatureSumOfWeek = temperatureSumOfWeek + item.temperature;
        humiditySumOfWeek = humiditySumOfWeek + item.humidity;
      }
        let averageTemperature = temperatureSumOfWeek / index;
        let averageHumidity = humiditySumOfWeek / index;
        temperatureDataPoints.push(Math.round(averageTemperature));
        humidityDataPoints.push(Math.round(averageHumidity));
        xAxisLabels.push(this.getWeekDayStringFromDate(lastDate))
        dataSet.push(this.createWeatherGraphDataSet(temperatureDataPoints, humidityDataPoints, xAxisLabels, label));

        console.log("Created History By Week")
        return dataSet;
      }
      return [];
    }

  getHistoryDataSetHoursPerDayFrom(weatherHistoryData: WeatherHistoryData): GraphDataSet[] {
    if (weatherHistoryData.datapoints.length > 0) {
      var dataSet: GraphDataSet[] = []
      var dataPoints = weatherHistoryData.datapoints

      dataPoints.sort((a, b) => {
        return b.timestamp.getTime() - a.timestamp.getTime()
      });

      var lastDate: Date = dataPoints[0].timestamp;
      var lastHour: number = lastDate.getHours();
      var label: string = this.getDateStringFromDate(lastDate);
      var temperatureDataPoints: number[]  = []; 
      var humidityDataPoints : number[] = [];
      var xAxisLabels: string[] = [];
      var temperatureSumOfWeek = 0
      var humiditySumOfWeek = 0
      let index = 0

      for (let item of dataPoints) {
        if(lastDate.getHours() > item.timestamp.getHours()) {
          let averageTemperature = temperatureSumOfWeek / index;
          let averageHumidity = humiditySumOfWeek / index;
          temperatureDataPoints.push(Math.round(averageTemperature));
          humidityDataPoints.push(Math.round(averageHumidity));
          xAxisLabels.push(this.getHourString(lastHour))
          index = 0;
          temperatureSumOfWeek = 0;
          humiditySumOfWeek = 0;
          lastDate = item.timestamp
          if(lastDate > item.timestamp) {
            dataSet.push(this.createWeatherGraphDataSet(temperatureDataPoints, humidityDataPoints, xAxisLabels, label));
            temperatureDataPoints = [];
            humidityDataPoints = [];
            xAxisLabels = [];
            lastDate = item.timestamp;
            lastHour = lastDate.getHours();
            label = this.getDateStringFromDate(lastDate);
          }
        }
        index = index + 1;
        temperatureSumOfWeek = temperatureSumOfWeek + item.temperature;
        humiditySumOfWeek = humiditySumOfWeek + item.humidity;
      }
        let averageTemperature = temperatureSumOfWeek / index;
        let averageHumidity = humiditySumOfWeek / index;
        temperatureDataPoints.push(Math.round(averageTemperature));
        humidityDataPoints.push(Math.round(averageHumidity));
        xAxisLabels.push(this.getHourString(lastHour))
        dataSet.push(this.createWeatherGraphDataSet(temperatureDataPoints, humidityDataPoints, xAxisLabels, label));

        console.log("Created History By Week")
        return dataSet;
      }
      return [];
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
      temperatureDataPoints: temperatureData.reverse(),
      humidityDataPoints: humidityData.reverse(),
      xAxisLabel: xAxisLabels.reverse(),
      label: label,
      temperatureAverage: Math.round(tempAverage),
      humidityAverage: Math.round(humidityAverage),
    }
  }

  private getWeekNumber(date: Date) {
    var date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
    return Math.ceil((((date.valueOf() - yearStart.valueOf()) / 86400000) + 1)/7)
  };
}
