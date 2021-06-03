import { Injectable } from '@angular/core';
import { GraphDataSet, OutdoorWeatherData, WeatherHistoryData } from '../model/weather';

/**
 * History tile service injectable
 * 
 * Use this service to convert WeatherHistoryData objects to GraphDataSet[ ] objects.
 */
@Injectable({
  providedIn: 'root'
})
export class HistoryTileService {
  constructor() { 
  }

  /**
   * Converts the datapoints of a WeahterHistoryData object to a GraphDataSet[ ] object
   * In this way all components which are using the external charts library can easily
   * show the prefered data without any further conversion. 
   * 
   * @param {WeatherHistoryData} weatherHistoryData  The history data object to convert 
   * @returns The history data sorted by days per week per GraphDataSet object
   */
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

  /**
   * Converts the datapoints of a WeahterHistoryData object to a GraphDataSet[ ] object
   * In this way all components which are using the external charts library can easily
   * show the prefered data without any further conversion. 
   * 
   * @param {WeatherHistoryData} weatherHistoryData  The history data object to convert 
   * @returns The history data sorted by hours per day per GraphDataSet object
   */
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
          lastHour = lastDate.getHours();

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

      console.log("Created History By Day")
      return dataSet;
    }
    return [];
  }

  /**
   * @ignore
   * 
   * @param {number} hour 
   * @returns A readable string of the hour
   */
  private getHourString(hour: number): string {
    return hour + " Uhr";
  }

  /**
   * @ignore
   * 
   * @param {number} week 
   * @returns A readable string of the week
   */
  private getWeekStringFromWeekNumber(week: number): string {
    return "Kalenderwoche " + week;
  }
  
  /**
   * @ignore
   * 
   * @param {date} date 
   * @returns A readable string of the WEEKDAY
   */
  private getWeekDayStringFromDate(date: Date): string {
    return DAYS[date.getDay()]
  }

  /**
   * @ignore
   * 
   * @param {number} hour 
   * @returns A readable string of the date
   */
  private getDateStringFromDate(date: Date): string {
    let day = date.getDate();
    let month = MONTHS[date.getMonth()];
    let year = date.getFullYear();

    return DAYS[date.getDay()] + ", " + day + " " + month + " " + year
  }

  /**
   * @ignore
   * 
   * @param {Date} date 
   * @returns A readable string of the week number of the year
   */
  private getWeekNumber(date: Date) {
    var date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
    return Math.ceil((((date.valueOf() - yearStart.valueOf()) / 86400000) + 1)/7)
  };

  /**
   * @ignore
   * 
   * Calculates the average temperature and humidity for the 
   * GraphDataSet object
   * 
   * @param {number[]} temperatureData 
   * @param {number[]} humidityData 
   * @param {string[]} xAxisLabels
   * @param {string} label
   * @returns A GraphDataSet object
   */
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
}



/**
 * @ignore
 * 
 * Readable string constants of days and months
 */
const DAYS = ['So','Mo','Di','Mi','Do','Fr','Sa'];
const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

