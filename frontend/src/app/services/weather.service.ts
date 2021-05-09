import { Injectable } from '@angular/core';
import { FORECAST, INDOORAIRQUALITY, OUTDOORWEATHER, POLLEN } from '../model/mock-data/weather.mock';
import { OutdoorWeatherData, PollenData, IndoorRoomData, Daytime, WeatherForecastData } from '../model/weather';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor() { }

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

  getForecastData(): Observable<WeatherForecastData> {
    let forecastData = of(FORECAST);
    return forecastData;
  }

  // NICHT DURCHDACHT... Wie wollen wir das lösen?
  getDaytime(): Daytime {
    const date = new Date()
    console.log(date.getHours())
    return Daytime.night;
  }
}
