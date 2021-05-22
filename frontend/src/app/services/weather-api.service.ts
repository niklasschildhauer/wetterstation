import { Injectable } from '@angular/core';
import { FORECAST, INDOORAIRQUALITY, INDOORAIRQUALITY2, OUTDOORWEATHER, POLLEN, WEATHERHISTORY } from '../model/mock-data/weather.mock';
import { OutdoorWeatherData, PollenData, IndoorRoomData, Daytime, WeatherForecastData, WeatherHistoryData } from '../model/weather';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WeatherAPIService {
  constructor() { }

  // DELETE ME
  getOutdoorWeather(): Observable<OutdoorWeatherData> {
    let weather = of(OUTDOORWEATHER);
    return weather;
  }

  getPollen(): Observable<PollenData[]> {
    let pollen = of(POLLEN);
    return pollen;
  }

  getIndoorRoomData(): Observable<IndoorRoomData[]> {
    let indoorData = of(INDOORAIRQUALITY);
    return indoorData;
  }

  getIndoorRoomData2(): Observable<IndoorRoomData[]> {
    let indoorData = of(INDOORAIRQUALITY2);
    return indoorData;
  }

  getForecastData(): Observable<WeatherForecastData> {
    let forecastData = of(FORECAST);
    return forecastData;
  }

  getHistoryData(): Observable<WeatherHistoryData> {
    let forecastData = of(WEATHERHISTORY);
    return forecastData;
  }

  // NICHT DURCHDACHT... Wie wollen wir das lösen?
  getDaytime(): Daytime {
    const date = new Date()
    console.log(date.getHours())
    return Daytime.noon;
  }
}
