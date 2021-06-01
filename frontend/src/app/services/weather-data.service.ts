import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, Subject} from 'rxjs';
import { IndoorRoomData, OutdoorWeatherData, PollenData, Tile, WeatherData, WeatherForecastData, WeatherHistoryData } from '../model/weather';
import { TileService, TileArrays } from './tile.service';
import { UserContextDelegte, UserContextService } from './user-context.service';
import { WeatherAPIService } from './weather-api.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {
  private _dashboardTiles: BehaviorSubject<Tile<WeatherData>[]> = new BehaviorSubject<Tile<WeatherData>[]>([]);
  private _pollenTiles: BehaviorSubject<Tile<WeatherData>[]> =  new BehaviorSubject<Tile<WeatherData>[]>([]);
  private _indoorRoomTiles: BehaviorSubject<Tile<WeatherData>[]> =  new BehaviorSubject<Tile<WeatherData>[]>([]);

  private _pollenData: BehaviorSubject<PollenData[] | undefined> = new BehaviorSubject<PollenData[]  | undefined>(undefined);
  private _indoorRoomsData: BehaviorSubject<IndoorRoomData[] | undefined> = new BehaviorSubject<IndoorRoomData[]  | undefined>(undefined);
  private _forecastData: BehaviorSubject<WeatherForecastData | undefined> = new BehaviorSubject<WeatherForecastData | undefined>(undefined);
  private _historyData: BehaviorSubject<WeatherHistoryData | undefined> = new BehaviorSubject<WeatherHistoryData | undefined>(undefined);
  private _outdoorWeatherData: BehaviorSubject<OutdoorWeatherData | undefined> = new BehaviorSubject<OutdoorWeatherData | undefined>(undefined);

  private _oldestHistoryData = Date.now();

  constructor(private tileService: TileService,
    private weatherAPIService: WeatherAPIService,
    private userContextService: UserContextService) { 
      this.loadWeatherData();
      this.registerForUserContextChange()
    }

  private loadWeatherData() {
    let outDoorWeather = this.weatherAPIService.getOutdoorWeather()
    let pollen = this.weatherAPIService.getPollen()
    let forecast = this.weatherAPIService.getForecastData()
    let history = this.loadMonthFromHistory(new Date(this._oldestHistoryData));
    let indoorRoom = this.weatherAPIService.getIndoorRoomData()

    forkJoin([outDoorWeather, pollen, forecast, history, indoorRoom]).subscribe(results => {
      this._outdoorWeatherData.next(results[0]);
      this._pollenData.next(results[1]);
      this._forecastData.next(results[2]);
      this._historyData.next(results[3]);
      this._indoorRoomsData.next(results[4]);

      this.reloadTiles();
    });
  }

  private registerForUserContextChange() {
    this.userContextService.getUserContext().subscribe(() => {
      this.reloadTiles()
    })
  }

  reloadTiles() {
    let outdoorWeatherData = this._outdoorWeatherData.getValue()
    let pollenData = this._pollenData.getValue();
    let forecastData = this._forecastData.getValue();
    let historyData = this._historyData.getValue();
    let indoorRoomData = this._indoorRoomsData.getValue();

    if(pollenData && forecastData && historyData && indoorRoomData && outdoorWeatherData) {
      let result = this.tileService.createTiles(outdoorWeatherData, 
                                                pollenData, 
                                                forecastData, 
                                                historyData, 
                                                indoorRoomData)
      this._dashboardTiles.next(result.dashboard);
      this._pollenTiles.next(result.pollen);
      this._indoorRoomTiles.next(result.indoorRooms);
    }
  }

  reloadData(): void {
    this.loadWeatherData();
  }

  // Getter methods
  getDashboardTiles(): BehaviorSubject<Tile<WeatherData>[]>{
    return this._dashboardTiles;
  }  

  getIndoorTiles() : BehaviorSubject<Tile<WeatherData>[]>{
    return this._indoorRoomTiles
  }

  getPollenTiles(): BehaviorSubject<Tile<WeatherData>[]>{
    return this._pollenTiles
  } 

  getOutdoorWeatherData(): BehaviorSubject<OutdoorWeatherData | undefined> {
    return this._outdoorWeatherData
  }

  getForecastData(): BehaviorSubject<WeatherForecastData | undefined> {
    return this._forecastData;
  }

  getHistoryData(): BehaviorSubject<WeatherHistoryData | undefined> {
    return this._historyData;
  }

  loadMoreHistoryData(): Observable<WeatherHistoryData> {
    let observable = this.loadMonthFromHistory(new Date(this._oldestHistoryData));
    observable.subscribe( data => {
      let historyData = this._historyData.getValue();
      if(historyData) {
        console.log(data);
        console.log(this._historyData);
        this._historyData.next({
          datapoints: historyData.datapoints.concat(data.datapoints)
        });
        console.log(this._historyData);
      }
    });
    return observable
  }

  private loadMonthFromHistory(oldestHistoryDate: Date): Observable<WeatherHistoryData> {
    let fromDate = new Date(oldestHistoryDate);
    let toDate: Date;
    if(oldestHistoryDate.getMonth() < 1) {
      this._oldestHistoryData = oldestHistoryDate.setFullYear(oldestHistoryDate.getFullYear() - 1);
      this._oldestHistoryData = oldestHistoryDate.setMonth(11);
    } else {
      this._oldestHistoryData = oldestHistoryDate.setMonth(oldestHistoryDate.getMonth() - 1);
    }
    toDate = new Date(this._oldestHistoryData);
    return this.weatherAPIService.getHistoryData(fromDate, toDate)
  }
}
