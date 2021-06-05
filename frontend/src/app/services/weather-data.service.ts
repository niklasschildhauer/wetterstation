import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, Subject} from 'rxjs';
import { Daytime, IndoorRoomData, OutdoorWeatherData, PollenData, Tile, WeatherData, WeatherForecastData, WeatherHistoryData } from '../model/weather';
import { TileService } from './tile.service';
import { UserContextService } from './user-context.service';
import { WeatherAPIService } from './weather-api.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {
  private set dashboardTiles(tiles: Tile<WeatherData>[]) {
    this._dashboardTiles.next(tiles);
  }
  private _dashboardTiles: BehaviorSubject<Tile<WeatherData>[]> = new BehaviorSubject<Tile<WeatherData>[]>([]);
  public getDashboardTilesSubject(): BehaviorSubject<Tile<WeatherData>[]>{
    return this._dashboardTiles;
  }  

  private set pollenTiles(tiles: Tile<WeatherData>[]) {
    this._pollenTiles.next(tiles);
  }
  private _pollenTiles: BehaviorSubject<Tile<WeatherData>[]> =  new BehaviorSubject<Tile<WeatherData>[]>([]);
  public getPollenTilesSubject(): BehaviorSubject<Tile<WeatherData>[]>{
    return this._pollenTiles
  } 

  private set indoorRoomTiles(tiles: Tile<WeatherData>[]) {
    this._indoorRoomTiles.next(tiles);
  }
  private _indoorRoomTiles: BehaviorSubject<Tile<WeatherData>[]> =  new BehaviorSubject<Tile<WeatherData>[]>([]);
  public getIndoorTilesSubject() : BehaviorSubject<Tile<WeatherData>[]>{
    return this._indoorRoomTiles
  }

  private get pollenData(): PollenData[] | undefined {
    return this._pollenData.getValue();
  }
  private set pollenData(value: PollenData[] | undefined) {
    this._pollenData.next(value);
  }
  private _pollenData: BehaviorSubject<PollenData[] | undefined> = new BehaviorSubject<PollenData[] | undefined>(undefined);

  private get indoorRoomsData(): IndoorRoomData[] | undefined {
    return this._indoorRoomsData.getValue();
  }
  private set indoorRoomsData(value: IndoorRoomData[] | undefined) {
    this._indoorRoomsData.next(value);
  }
  private _indoorRoomsData: BehaviorSubject<IndoorRoomData[] | undefined> = new BehaviorSubject<IndoorRoomData[]  | undefined>(undefined);

  private get forecastData(): WeatherForecastData | undefined {
    return this._forecastData.getValue();
  }
  private set forecastData(value: WeatherForecastData | undefined) {
    this._forecastData.next(value);
  }
  private _forecastData: BehaviorSubject<WeatherForecastData | undefined> = new BehaviorSubject<WeatherForecastData | undefined>(undefined);
  public getForecastDataSubject(): BehaviorSubject<WeatherForecastData | undefined> {
    return this._forecastData;
  }

  private get historyData(): WeatherHistoryData | undefined {
    return this._historyData.getValue();
  }
  private set historyData(value: WeatherHistoryData | undefined) {
    this._historyData.next(value);
  }
  private _historyData: BehaviorSubject<WeatherHistoryData | undefined> = new BehaviorSubject<WeatherHistoryData | undefined>(undefined);
  public getHistoryDataSubject(): BehaviorSubject<WeatherHistoryData | undefined> {
    return this._historyData;
  }

  private get outdoorWeatherData(): OutdoorWeatherData | undefined {
    return this._outdoorWeatherData.getValue();
  }
  private set outdoorWeatherData(value: OutdoorWeatherData | undefined) {
    this._outdoorWeatherData.next(value);
  }
  private _outdoorWeatherData: BehaviorSubject<OutdoorWeatherData | undefined> = new BehaviorSubject<OutdoorWeatherData | undefined>(undefined);
  public getOutdoorWeatherDataSubject(): BehaviorSubject<OutdoorWeatherData | undefined> {
    return this._outdoorWeatherData
  }

  private oldestHistoryData = Date.now();

  constructor(private tileService: TileService,
              private weatherAPIService: WeatherAPIService,
              private userContextService: UserContextService) { 
      this.loadWeatherData();
      this.registerForUserContextChange()
    }

  private loadWeatherData() {
    this.oldestHistoryData = Date.now();
    
    let outDoorWeather = this.weatherAPIService.loadOutdoorWeather()
    let pollen = this.weatherAPIService.loadPollen()
    let forecast = this.weatherAPIService.loadForecastDataSubject()
    let history = this.loadMonthFromHistory(new Date(this.oldestHistoryData));
    let indoorRoom = this.weatherAPIService.loadIndoorRoomData()

    forkJoin([outDoorWeather, pollen, forecast, history, indoorRoom]).subscribe(results => {
      this.outdoorWeatherData = results[0];
      this.pollenData = results[1];
      this.forecastData = results[2];
      this.historyData = results[3];
      this.indoorRoomsData = results[4];

      this.reloadTiles();
    });
  }

  private registerForUserContextChange() {
    this.userContextService.getUserContextSubject().subscribe(() => {
      this.reloadTiles()
    })
  }

  public reloadTiles() {
    let outdoorWeatherData = this.outdoorWeatherData;
    let pollenData = this.pollenData;
    let forecastData = this.forecastData;
    let historyData = this.historyData
    let indoorRoomData = this.indoorRoomsData;

    if(pollenData && forecastData && historyData && indoorRoomData && outdoorWeatherData) {
      let result = this.tileService.createTiles(outdoorWeatherData, 
                                                pollenData, 
                                                forecastData, 
                                                historyData, 
                                                indoorRoomData)
      this.dashboardTiles = result.dashboard;
      this.pollenTiles = result.pollen;
      this.indoorRoomTiles = result.indoorRooms;
    }
  }

  public reloadData(): void {
    this.loadWeatherData();
  }

  public getDaytime(): Daytime {
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

  public loadMoreHistoryData(): Observable<WeatherHistoryData> {
    let observable = this.loadMonthFromHistory(new Date(this.oldestHistoryData));
    observable.subscribe(data => {
      let historyData = this.historyData
      if(historyData) {
        this.historyData = {
          datapoints: historyData.datapoints.concat(data.datapoints)
        };
      }
    });
    return observable
  }

  private loadMonthFromHistory(oldestHistoryDate: Date): Observable<WeatherHistoryData> {
    let fromDate = new Date(oldestHistoryDate);
    let toDate: Date;
    if(oldestHistoryDate.getMonth() < 1) {
      this.oldestHistoryData = oldestHistoryDate.setFullYear(oldestHistoryDate.getFullYear() - 1);
      this.oldestHistoryData = oldestHistoryDate.setMonth(11);
    } else {
      this.oldestHistoryData = oldestHistoryDate.setMonth(oldestHistoryDate.getMonth() - 1);
    }
    toDate = new Date(this.oldestHistoryData);
    return this.weatherAPIService.loadHistoryDataSubject(fromDate, toDate)
  }
}
