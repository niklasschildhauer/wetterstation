import { Injectable } from '@angular/core';
import { INDOORAIRQUALITY, OUTDOORWEATHER, POLLEN } from '../model/mock-data/weather.mock';
import { OutdoorWeatherData, PollenData, IndoorRoomData } from '../model/weather';
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
    return pollen;
  }

  getIndoorRoomData(): Observable<IndoorRoomData[]> {
    const indoorData = of(INDOORAIRQUALITY);
    return indoorData;
  }

  changeTemp() {
      OUTDOORWEATHER.temperature = OUTDOORWEATHER.temperature + 2;
  }

}
