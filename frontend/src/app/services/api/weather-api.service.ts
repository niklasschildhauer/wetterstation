import { Injectable } from '@angular/core';
import { FORECAST, INDOORAIRQUALITY, OUTDOORWEATHER, POLLEN, WEATHERHISTORY } from '../../model/mock-data/weather.mock';
import { OutdoorWeatherData, PollenData, IndoorRoomData, WeatherForecastData, WeatherHistoryData } from '../../model/weather';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


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

  private createServerFriendlyDate(date: Date): string {
    let dateString = date.toISOString().slice(0, 10);
    let timeString = date.toTimeString().slice(0, 8);
    return dateString + ' ' + timeString;
  }

  private createOutdoorWeatherDataFromServerResponse(response: OutdoorWeatherResponse): OutdoorWeatherData {
    return {
            temperature: response.temperature,
            maxTemperature: -99, // Nicht so wichtig
            minTemperature: -99, // Nicht so wichtig
            humidity: response.humidity,
            timestamp: new Date(response.timestamp),
            weather: response.weather,
            apparentTemperature: response.apparentTemperature,
            location: response.location_name,
            postCode: response.location
          }
  }

  private createIndoorRoomDataFromServerResponse(response: IndoorRoomResponse): IndoorRoomData {
    return {
            roomID: response.id + '',
            roomName: response.location,
            airQuality: response.gasVal, 
            temperature: response.temperature, 
            humidity: response.humidity, 
            timestamp: new Date(response.timestamp), 
          }
  }

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
    console.log("Pollen daten sind hier", pollen)

    return pollen
  }

  private createOutdoorForecastDataFromServerResponse(response: ForecastResponse): WeatherForecastData {
    return {
      trend: response.trend,
      weatherDescription: response.weatherDescription, 
      weatherIcon: response.weatherIcon
    }
  }
}

interface PollenResponse {
  id: number,
  pollenName: string,
  loadRating: string,
}

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

interface IndoorRoomResponse {
  id: number,
  humidity: number,
  temperature: number,
  pressure: number,
  gasVal: number,
  location: string,
  timestamp: string,
}

interface ForecastResponse {
  id: number,
  trend: string,
  weatherIcon: string,
  weatherDescription: string,
  seaPressure: number,
  timestampd: string
}