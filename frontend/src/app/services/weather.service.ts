import { Injectable } from '@angular/core';
import { OUTDOORWEATHER, POLLEN } from '../model/mock-data/weather.mock';
import { OutdoorWeather, Pollen } from '../model/weather';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor() { }

  getOutdoorWeather(): Observable<OutdoorWeather> {
    const weather = of(OUTDOORWEATHER);
    return weather;
  }

  getPollen(): Observable<Pollen[]> {
    const pollen = of(POLLEN);
    return pollen;
  }

  changeTemp() {
      OUTDOORWEATHER.temperature = OUTDOORWEATHER.temperature + 2;
  }

}
