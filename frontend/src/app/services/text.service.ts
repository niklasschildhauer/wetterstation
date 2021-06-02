import { MapType } from '@angular/compiler';
import { Injectable } from '@angular/core';

import { IndoorRoomData, OutdoorWeatherData, PollenData, Tile, TileType, WeatherForecastData } from '../model/weather';
import { WeatherData } from '../model/weather';

@Injectable({
  providedIn: 'root'
})
export class TextService {

  constructor() { }

  createTextFromTilesArray(array: Tile<WeatherData>[] | undefined): string {
    var readAloud = ""
    if(array) {
      array.forEach(element => {
        switch(element.type){
          case TileType.pollenList: 
            let pollenDataArray = element.data as PollenData[];
            pollenDataArray.forEach(element => {
              readAloud = readAloud + this.createPollenText(element);
            });
          break;
          case TileType.indoorRoom: 
            let indoorArray = element.data as IndoorRoomData;
            readAloud = readAloud + this.createIndoorRoomText(indoorArray);
          break;
          case TileType.forecast: 
            let forecastData = element.data as WeatherForecastData;
            readAloud = readAloud + this.createForecastText(forecastData);
          break;
          case TileType.pollenSmall: 
            let pollenData = element.data as PollenData;
            readAloud = readAloud + this.createPollenText(pollenData);
          break
          default: "Not implemented"
        }
      });
    }
    console.log(readAloud);
    return readAloud;
  }

  createForecastText(data: WeatherForecastData | undefined): string {
    var readAloud = ""
    if(data) {
      let forecast = data.forecast
      readAloud = "Im Verlaufe des Tages wird es " + forecast + "werden. ";
    }
    return readAloud
  }

  createIndoorRoomText(data: IndoorRoomData | undefined): string {
    var readAloud = ""
    if(data) {
      let room = data.roomName
      let quality = data.airQuality
      let temperature = data.temperature

      readAloud = "Im " + room + " hat es " + temperature + " Grad Celsius und die Luftqualität liegt bei " + quality + ". ";
    }
    return readAloud

  }

  createPollenText(data: PollenData | undefined): string {
    var readAloud = ""
    if(data) {
      // CHANGE VALUE OF 1 to LEICH, MITTEL, STARK und KEINE
      let name = data.pollenName
      let value = data.today
      readAloud = "Pollen der Art " + name + " hat heute eine Belastung von " + value +  ". ";
    }

    return readAloud
  }

  createOutdoorText(data: OutdoorWeatherData | undefined): string {
    var readAloud = ""
    if(data) {
      // adjust number pronounciation
      let location = data.location
      let temperature = data.temperature
      let apparentTemperature = data.apparentTemperature
      let maxTemperature = data.maxTemperature
      let minTemperature = data.minTemperature
      let humidity = data.humidity

      readAloud = "In " + location + "hat es aktuell " + temperature + " Grad Celsius. Diese fühlen sich an wie  "
      + apparentTemperature + ". Die heutigen Extremwerte liegen bei " + maxTemperature + " und " + minTemperature + "Grad Celsius. Die Luftfeuchtigkeit beträgt aktuell  "
      + humidity + ". ";
      ;
    }
    return readAloud
  }
}
