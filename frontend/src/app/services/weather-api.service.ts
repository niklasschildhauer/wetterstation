import { Injectable } from '@angular/core';
import { FORECAST, INDOORAIRQUALITY, INDOORAIRQUALITY2, OUTDOORWEATHER, POLLEN, WEATHERHISTORY } from '../model/mock-data/weather.mock';
import { OutdoorWeatherData, PollenData, IndoorRoomData, Daytime, WeatherForecastData, WeatherHistoryData, WeatherType } from '../model/weather';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WeatherAPIService {
  private outdoorURL = "/weather-data/outdoor/latest"
  private indoorURL = "/weather-data/indoor/latest"
  private historyURL = "/weather-data/outdoor/history"

  constructor(private httpClient: HttpClient) { }

  getOutdoorWeather(): Observable<OutdoorWeatherData> {
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
  

  getPollen(): Observable<PollenData[]> {
    let pollen = of(POLLEN);
    return pollen;
  }

  getIndoorRoomData(): Observable<IndoorRoomData[]> {
    if (environment.testData) {
      let indoorData = of(INDOORAIRQUALITY);
      return indoorData;
    }
    let returnObservable = new Observable<IndoorRoomData[]>((observer) => { // Wir brauchen hier ein Array, -> sollen ja mehrere Räume möglich sein (theoretisch...)
        this.httpClient.get<IndoorRoomResponse>(this.indoorURL).subscribe(data => {
          let indoorData = this.createIndoorRoomDataFromServerResponse(data);
          observer.next([indoorData]);
          observer.complete();
        })
      }
    );
    return returnObservable;
  }

  getForecastData(): Observable<WeatherForecastData> {
    let forecastData = of(FORECAST);
    return forecastData;
  }

  getHistoryData(endDate: Date, beginDate: Date): Observable<WeatherHistoryData> {
    if (environment.testData) {
      let forecastData = of(WEATHERHISTORY);
      return forecastData;
    }
    let returnObservable = new Observable<WeatherHistoryData>((observer) => { 
        this.httpClient.post<OutdoorWeatherResponse[]>(this.historyURL,
          {
            "begin": this.createServerFriendlyDate(beginDate),
            "end": this.createServerFriendlyDate(endDate)
          })
        .subscribe(data => {
          let dataPoints: OutdoorWeatherData[] = data.map((element) => {
            return this.createOutdoorWeatherDataFromServerResponse(element);
          });
          console.log(dataPoints);
          observer.next({"datapoints": dataPoints});
          observer.complete();
        })
      }
    );
    return returnObservable;
  }

  // NICHT DURCHDACHT... Wie wollen wir das lösen?
  getDaytime(): Daytime {
    const date = new Date();
    const dayHour = date.getHours();
    if(dayHour < 6){
      return Daytime.night;
    } 
    if (dayHour < 18) {
      return Daytime.noon;
    }
    if(dayHour < 21) {
      return Daytime.dawn;
    }
    return Daytime.night;
  }
  

  private createServerFriendlyDate(date: Date): string {
    let dateString = date.toISOString().slice(0, 10);
    let timeString = date.toTimeString().slice(0, 8);
    return dateString + " " + timeString;
  }

  private createOutdoorWeatherDataFromServerResponse(response: OutdoorWeatherResponse): OutdoorWeatherData {
    return {
            temperature: response.temperature,
            maxTemperature: -99, // Nicht so wichtig
            minTemperature: -99, // Nicht so wichtig
            humidity: response.humidity,
            timestamp: new Date(response.timestamp),
            weather: WeatherType.sunny, // DER WERT WÄRE GANZ NICE
            apparentTemperature: response.apparentTemperature,
            location: response.location,
          }
  }

  private createIndoorRoomDataFromServerResponse(response: IndoorRoomResponse): IndoorRoomData {
    return {
            roomID: response.id + "",
            roomName: response.location,
            airQuality: response.gasVal, 
            temperature: response.temperature, 
            humidity: response.humidity, 
            timestamp: new Date(response.timestamp), 
          }
  }
}

interface OutdoorWeatherResponse {
  id: number,
  humidity: number,
  temperature: number,
  pressure: number,
  location: string,
  timestamp: string,
  apparentTemperature: number
}

interface IndoorRoomResponse{
  id: number,
  humidity: number,
  temperature: number,
  pressure: number,
  gasVal: number,
  location: string,
  timestamp: string,
}