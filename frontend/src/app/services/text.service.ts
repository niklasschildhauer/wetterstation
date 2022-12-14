import { Injectable } from '@angular/core';
import { IndoorRoomData, OutdoorWeatherData, PollenData, Tile, TileType, WeatherForecastData } from '../model/weather';
import { WeatherData } from '../model/weather';

/**
 * Text service injectable
 * 
 * Use this service to create text from WeatherData objects, e.g. create text to read it aloud
 * with the speech service. 
 */
@Injectable({
  providedIn: 'root'
})
export class TextService {

  constructor() { }
  
  /**
  * Create a readable text from tiles array object of WeatherData
  * 
  * @param {Tile<WeatherData>[]} array  The data array
  * @returns A readable text version from the input array. 
  */
  public createTextFromTilesArray(array: Tile<WeatherData>[] | undefined): string {
    let readAloud = ''
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
          default: 'Not implemented'
        }
      });
    }
    console.log(readAloud);
    return readAloud;
  }

  /**
  * Create a readable text from WeatherForecastData object
  * 
  * @param {WeatherForecastData | undefined} data 
  * @returns A readable text version from the input data. 
  */
  public createForecastText(data: WeatherForecastData | undefined): string {
    let readAloud = ''
    if(data) {
      let forecast = data.weatherDescription
      switch (forecast) {
        case 'Clear': 
          readAloud = "Im Verlaufe des Tages wird es wolkenlos. "
          break;
        case 'Sunny and moderately cloudy.': 
          readAloud = "Im Verlaufe des Tages wird es sonnig mit ein paar Wolken. "
          break;
        case 'Rather cloudy': 
          readAloud = "Im Verlaufe des Tages wird es bedeckt mit vereinzelten Sonnenstrahlen werden. "
          break;
        case 'Rainy': 
          readAloud = "Im Verlaufe des Tages wird es regnen. "
          break;
        case 'Worsening': 
          readAloud = "Im Verlaufe des Tages wird es schlechter werden. "
          break;
      }

      let trend = data.trend
      switch (trend) {
        case 'rising': 
          readAloud = readAloud + "Tendenz steigend. "
          break;
        case 'falling': 
          readAloud = readAloud + "Tendenz fallend. "
          break;
        case 'steady': 
          readAloud = readAloud + "Tendenz konsistent. "
          break;
      }
    }
    return readAloud
  }

  /**
  * Create a readable title from WeatherForecastData object
  * 
  * @param {WeatherForecastData | undefined} data 
  * @returns A readable title version from the input data. 
  */
    public createForecastTitle(data: WeatherForecastData | undefined): string {
      let title = ''
      if(data) {
        let forecast = data.weatherDescription
        switch (forecast) {
          case 'Clear': 
            title = 'Wolkenlos';
            break;
          case 'Sunny and moderately cloudy.': 
            title = 'Leicht bedeckt';
            break;
          case 'Rather cloudy': 
            title = 'Bew??lkt';
            break;
          case 'Rainy': 
            title = 'Regen';
            break;
          case 'Worsening': 
            title = 'Schlecht';
            break;
        }
      }
      return title
    }


  /**
  * Create a readable text from IndoorRoomData object
  * 
  * @param {IndoorRoomData | undefined} data 
  * @returns A readable text version from the input data. 
  */
  public createIndoorRoomText(data: IndoorRoomData | undefined): string {
    let readAloud = ''
    if(data) {
      let room = data.roomName
      let quality = data.airQuality
      let temperature = data.temperature

      readAloud = 'Im ' + room + ' hat es ' + temperature + ' Grad Celsius und die Luftqualit??t liegt bei ' + quality + '. ';
    }
    return readAloud

  }

  /**
  * Create a readable text from PollenData object
  * 
  * @param {PollenData | undefined} data 
  * @returns A readable text version from the input data. 
  */
  public createPollenText(data: PollenData | undefined): string {
    let readAloud = ''
    if(data) {
      let name = data.pollenName
      let value = data.today
      switch (value) {
        case '1':
        case '1-2':
          readAloud = name + 'Pollen haben heute eine niedrige Belastung. ';
          break;
        case '2':
        case '2-3':
          readAloud = name + 'Pollen haben heute eine mittlere Belastung. ';
          break;
        case '3': 
        case '3-4': 
        case '4': 
        case '5': 
        readAloud = name + 'Pollen haben heute eine hohe Belastung. ';
          break;
      }
    }
    return readAloud
  }

 /**
  * Create a readable text from OutdoorWeatherData object
  * 
  * @param {OutdoorWeatherData | undefined} data 
  * @returns A readable text version from the input data. 
  */
  public createOutdoorText(data: OutdoorWeatherData | undefined): string {
    let readAloud = ''
    if(data) {
      // adjust number pronounciation
      let location = data.location
      let temperature = data.temperature
      let apparentTemperature = data.apparentTemperature
      let maxTemperature = data.maxTemperature
      let minTemperature = data.minTemperature
      let humidity = data.humidity
      let weather = data.weather

      readAloud = "In " + location + " hat es aktuell " + temperature + " Grad Celsius. " 
      // + "Diese f??hlen sich an wie  " + apparentTemperature 
      // + ". Die heutigen Extremwerte liegen bei " + maxTemperature + " und " + minTemperature + "Grad Celsius. "
      + this.createWeatherText(weather) + " "
      + "Die Luftfeuchtigkeit betr??gt aktuell " + humidity + "%. ";
      ;
    }
    return readAloud
  }

  /**
  * Create a readable text from weather string
  * 
  * @param {string | undefined} data 
  * @returns A readable text version from the input data. 
  */
    public createWeatherText(data: string | undefined): string {
      let readAloud = ''
      if(data) {
        let weather = data;
        switch(weather) {
          case 'cloudy': 
            readAloud = 'Aktuell ist es bew??lkt.'
            break;
          case 'rain':
            readAloud = 'Im Moment regnet es.'
            break;
          case 'wind':
            readAloud = 'Zur Zeit ist es windig.'
            break;
          case 'sleet':
            readAloud = 'Es graupelt gerade.'
            break;
          case 'fog':
            readAloud = 'Achtung, es ist neblig.'
            break;
          case 'clear-day':
            readAloud = 'Die Sonne scheint, es hat eine klare Sicht.'
            break;
          case 'clear-night':
            readAloud = 'Der Mond scheint, es hat eine klare Sicht.'
            break;
          case 'partly-cloudy-day':
            readAloud = 'Es ist leicht bew??lkt, vereinzelt sonnig.'
            break;
          case 'partly-cloudy-night':
            readAloud = 'Es ist leicht bew??lkt.'
            break;
          case 'snow':
            readAloud = 'Aktuell schneit es.'
            break;
          case 'hail':
            readAloud = 'Achtung, es hagelt.'
            break;
          case 'thunderstorm':
            readAloud = 'Achtung, ein Gewitter tobt gerade.'
            break;
        }
      }
      return readAloud
    }
}
