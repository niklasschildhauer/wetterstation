import { Injectable } from '@angular/core';
import { OUTDOORWEATHER, POLLEN } from '../model/mock-data/weather.mock';
import { OutdoorWeatherData, PollenData } from '../model/weather';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor() { }

  getOutdoorWeather(): Observable<OutdoorWeatherData> {
    const weather = of(OUTDOORWEATHER);
    return weather;
  }

  getPollen(): Observable<PollenData[]> {
    const pollen = of(POLLEN);
    console.log("test")
    return pollen;
  }

  changeTemp() {
      OUTDOORWEATHER.temperature = OUTDOORWEATHER.temperature + 2;
  }

}
