import { Injectable } from '@angular/core';
import { INDOORAIRQUALITY, OUTDOORWEATHER, POLLEN } from '../model/mock-data/weather.mock';
import { OutdoorWeatherData, PollenData, IndoorRoomData, Daytime } from '../model/weather';
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

  // NICHT DURCHDACHT... Wie wollen wir das lösen?
  getDaytime(): Daytime {
    const date = new Date()
    console.log(date.getHours())
    return Daytime.night;
  }



  // DELETE ME
  changeTemp() {
      OUTDOORWEATHER.temperature = OUTDOORWEATHER.temperature + 2;
  }

}
