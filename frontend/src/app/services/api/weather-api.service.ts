import { Injectable } from '@angular/core';
import { FORECAST, INDOORAIRQUALITY, OUTDOORWEATHER, POLLEN, WEATHERHISTORY } from '../../model/mock-data/weather.mock';
import { OutdoorWeatherData, PollenData, IndoorRoomData, WeatherForecastData, WeatherHistoryData } from '../../model/weather';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

/**
 * Weather api service injectable
 * 
 * Use this service to access the network. It implementes all routes 
 * for the weather data.
 */
@Injectable({
  providedIn: 'root'
})
export class WeatherAPIService {
  private outdoorURL = environment.baseURL + 'weather-data/outdoor/latest';
  private indoorURL = environment.baseURL + 'weather-data/indoor/latest';
  private historyURL = environment.baseURL + 'weather-data/outdoor/history';
  private forecastURL = environment.baseURL + 'weather-data/forecast/latest';
  private allPollenTypesURL = environment.baseURL + 'pollen/all';

  constructor(private httpClient: HttpClient) { }

  /**
   * @returns an observable with the loadad OutdoorWeatherData from the api or test data
   */
  public loadOutdoorWeather(): Observable<OutdoorWeatherData> {
    if (environment.testData) {
      return of(OUTDOORWEATHER);
    }
    let returnObservable = new Observable<OutdoorWeatherData>((observer) => {
        this.httpClient.get<OutdoorWeatherResponse>(this.outdoorURL).subscribe(data => {
          let outdoorData = this.createOutdoorWeatherDataFromServerResponse(data);
          observer.next(outdoorData);
          observer.complete();
        })
      }
    );
    return returnObservable;
  }

  /**
   * @returns an observable with the loadad WeatherForecastData from the api or test data
   */
  public loadForecast(): Observable<WeatherForecastData> {
    if (environment.testData) {
      return of(FORECAST);
    }
    let returnObservable = new Observable<WeatherForecastData>((observer) => {
        this.httpClient.get<ForecastResponse>(this.forecastURL).subscribe(data => {
          let forecastData = this.createOutdoorForecastDataFromServerResponse(data);
          observer.next(forecastData);
          observer.complete();
        })
      }
    );
    return returnObservable;
  }

  /**
   * @returns an observable with the loadad PollenData from the api or test data
   */
  public loadPollen(): Observable<PollenData[]>{
    if (environment.testData) {
      let pollen = of(POLLEN);
      return pollen;
    }
    let returnObservable = new Observable<PollenData[]>((observer) => {
      let response = this.httpClient.get<PollenResponse[]>(this.allPollenTypesURL);
      response.subscribe(data => {
        let pollenData = this.createPollenDataFromServerResponse(data);
        observer.next(pollenData);
        observer.complete();
      },
      (error) => {
        console.log(error);
        observer.next([]);
        observer.complete();
      })
    });
    return returnObservable;
  }

  /**
   * @returns an observable with the loadad IndoorRoomData from the api or test data
   */
  public loadIndoorRoomData(): Observable<IndoorRoomData[]> {
    if (environment.testData) {
      let indoorData = of(INDOORAIRQUALITY);
      return indoorData;
    }
    let returnObservable = new Observable<IndoorRoomData[]>((observer) => { // Wir brauchen hier ein Array, -> sollen ja mehrere Räume möglich sein (theoretisch...)
        this.httpClient.get<IndoorRoomResponse>(this.indoorURL).subscribe(data => {
          let indoorData = this.createIndoorRoomDataFromServerResponse(data);
          observer.next([indoorData]);
          observer.complete();
        },
        (error) => {
          console.log(error);
          observer.next([]);
          observer.complete();
        })
      }
    );
    return returnObservable;
  }

  /**
   * @returns an observable with the loadad WeatherHistoryData or test data
   */
  public loadHistoryDataSubject(endDate: Date, beginDate: Date): Observable<WeatherHistoryData> {
    if (environment.testData) {
      let forecastData = of(WEATHERHISTORY);
      return forecastData;
    }
    let returnObservable = new Observable<WeatherHistoryData>((observer) => { 
        this.httpClient.post<OutdoorWeatherResponse[]>(this.historyURL,
          {
            'begin': this.createServerFriendlyDate(beginDate),
            'end': this.createServerFriendlyDate(endDate)
          })
        .subscribe(data => {
          let dataPoints: OutdoorWeatherData[] = data.map((element) => {
            return this.createOutdoorWeatherDataFromServerResponse(element);
          });
          console.log(dataPoints);
          observer.next({'datapoints': dataPoints});
          observer.complete();
        })
      }
    );
    return returnObservable;
  }

  /**
   * Helper function to convert date to string
   * @param date 
   * @returns a date as a string which is understandable for the server
   */
  private createServerFriendlyDate(date: Date): string {
    let dateString = date.toISOString().slice(0, 10);
    let timeString = date.toTimeString().slice(0, 8);
    return dateString + ' ' + timeString;
  }

  /**
   * Helper function to convert the response from the server to an OutdoorWeatherData object
   * 
   * @param response
   * @returns OutdoorWeatherData object
   */
  private createOutdoorWeatherDataFromServerResponse(response: OutdoorWeatherResponse): OutdoorWeatherData {
    const date = response.timestamp;
    const year = date.substr(0, 4);
    const month = date.substr(5, 2);
    const day = date.substr(8, 2);
    const time = date.substr(11);

    const validDate = new Date(month + '/' + day + '/' + year + ' ' + time);

    return {
            temperature: response.temperature,
            maxTemperature: -99, // Not implemented yet
            minTemperature: -99, // Not implemented yet
            humidity: response.humidity,
            timestamp: validDate,
            weather: response.weather,
            apparentTemperature: response.apparentTemperature,
            location: response.location_name,
            postCode: response.location
          }
  }

  /**
   * Helper function to convert the response from the server to an IndoorRoomData object
   * 
   * @param response
   * @returns IndoorRoomData object
   */
  private createIndoorRoomDataFromServerResponse(response: IndoorRoomResponse): IndoorRoomData {
    return {
            roomID: response.id + '',
            roomName: response.location,
            airQuality: response.gasVal, 
            temperature: response.temperature, 
            humidity: response.humidity, 
            timestamp: new Date(response.timestamp), 
            calibrationValue: response.gasValCalibrationValue,
          }
  }

  /**
   * Helper function to convert the response from the server to an PollenData[] object
   * 
   * @param response
   * @returns PollenData[] object
   */
  private createPollenDataFromServerResponse(response: PollenResponse[]): PollenData[] {
    console.log("Pollen daten sind hier", response)
    let pollen: PollenData[] = [];
    response.forEach(item => {
      pollen.push({
        id: item.id,
        pollenName: item.pollenName,
        today: item.loadRating,
        tomorrow: ''
      })
    })
    return pollen
  }

  /**
   * Helper function to convert the response from the server to an WeatherForecastData object
   * 
   * @param response
   * @returns WeatherForecastData object
   */
  private createOutdoorForecastDataFromServerResponse(response: ForecastResponse): WeatherForecastData {
    return {
      trend: response.trend,
      weatherDescription: response.weatherDescription, 
      weatherIcon: response.weatherIcon
    }
  }
}

/**
 * Model of the pollen api response
 */
interface PollenResponse {
  id: number,
  pollenName: string,
  loadRating: string,
}

/**
 * Model of the outdoor weather api response
 */
interface OutdoorWeatherResponse {
  id: number,
  humidity: number,
  temperature: number,
  pressure: number,
  location: string,
  location_name: string,
  timestamp: string,
  weather: string,
  apparentTemperature: number
}

/**
 * Model of the indoor room api response
 */
interface IndoorRoomResponse {
  id: number,
  humidity: number,
  temperature: number,
  pressure: number,
  gasVal: number,
  location: string,
  timestamp: string,
  gasValCalibrationValue: number,
}

/**
 * Model of the forecast api response
 */
interface ForecastResponse {
  id: number,
  trend: string,
  weatherIcon: string,
  weatherDescription: string,
  seaPressure: number,
  timestampd: string
}