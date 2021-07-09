import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, Subject} from 'rxjs';
import { Daytime, IndoorRoomData, OutdoorWeatherData, PollenData, Tile, WeatherData, WeatherForecastData, WeatherHistoryData } from '../model/weather';
import { TileService } from './tile.service';
import { UserContextService } from './user-context.service';
import { WeatherAPIService } from './api/weather-api.service';

/**
 * Weather data service injectable
 * 
 * Use this service to access all weather data from the backend
 */
@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {

  /**
  * Source of truth of all dashboard tiles data. Including setter for this service.
  * The BehaviorSubject is accessible through the getDashboardTilesSubject() function.
  */
  private _dashboardTiles: BehaviorSubject<Tile<WeatherData>[]> = new BehaviorSubject<Tile<WeatherData>[]>([]);
  private set dashboardTiles(tiles: Tile<WeatherData>[]) {
    this._dashboardTiles.next(tiles);
  }
 
  /**
  * Source of truth of pollen tiles data. Including setter for this service.
  * The BehaviorSubject is accessible through the getPollenTilesSubject() function.
  */
  private _pollenTiles: BehaviorSubject<Tile<WeatherData>[]> =  new BehaviorSubject<Tile<WeatherData>[]>([]);
  private set pollenTiles(tiles: Tile<WeatherData>[]) {
    this._pollenTiles.next(tiles);
  }

  /**
  * Source of truth of indoor room tiles data. Including setter for this service.
  * The BehaviorSubject is accessible through the getIndoorRoomTilesSubject() function.
  */
  private _indoorRoomTiles: BehaviorSubject<Tile<WeatherData>[]> =  new BehaviorSubject<Tile<WeatherData>[]>([]);
  private set indoorRoomTiles(tiles: Tile<WeatherData>[]) {
    this._indoorRoomTiles.next(tiles);
  }
  
 
  /**
  * Source of truth of pollen data. Including setter and getter for this service.
  */
  private _pollenData: BehaviorSubject<PollenData[] | undefined> = new BehaviorSubject<PollenData[] | undefined>(undefined);
  private get pollenData(): PollenData[] | undefined {
    return this._pollenData.getValue();
  }
  private set pollenData(value: PollenData[] | undefined) {
    this._pollenData.next(value);
  }

  /**
  * Source of truth of indoor room data. Including setter and getter for this service.
  */
  private _indoorRoomsData: BehaviorSubject<IndoorRoomData[] | undefined> = new BehaviorSubject<IndoorRoomData[]  | undefined>(undefined);
  private get indoorRoomsData(): IndoorRoomData[] | undefined {
    return this._indoorRoomsData.getValue();
  }
  private set indoorRoomsData(value: IndoorRoomData[] | undefined) {
    this._indoorRoomsData.next(value);
  }
 

  /**
  * Source of truth of forecast data. Including setter and getter for this service.
  */
  private _forecastData: BehaviorSubject<WeatherForecastData | undefined> = new BehaviorSubject<WeatherForecastData | undefined>(undefined);
  private get forecastData(): WeatherForecastData | undefined {
    return this._forecastData.getValue();
  }
  private set forecastData(value: WeatherForecastData | undefined) {
    this._forecastData.next(value);
  }

  /**
  * Source of truth of history data. Including setter and getter for this service.
  */
  private _historyData: BehaviorSubject<WeatherHistoryData | undefined> = new BehaviorSubject<WeatherHistoryData | undefined>(undefined);
  private get historyData(): WeatherHistoryData | undefined {
    return this._historyData.getValue();
  }
  private set historyData(value: WeatherHistoryData | undefined) {
    this._historyData.next(value);
  }

  /**
  * Source of truth of outdoor weather data. Including setter and getter for this service.
  */  
  private _outdoorWeatherData: BehaviorSubject<OutdoorWeatherData | undefined> = new BehaviorSubject<OutdoorWeatherData | undefined>(undefined);
  private get outdoorWeatherData(): OutdoorWeatherData | undefined {
    return this._outdoorWeatherData.getValue();
  }
  private set outdoorWeatherData(value: OutdoorWeatherData | undefined) {
    this._outdoorWeatherData.next(value);
  }

  /**
  * This date is important to enable lazy loading history data. Initially one month
  * is loaded. If more history data is needed, one month more will be downloaded.
  */  
  private oldestHistoryDate = Date.now();

  constructor(private tileService: TileService,
              private weatherAPIService: WeatherAPIService,
              private userContextService: UserContextService) { 
      this.loadWeatherData();
      this.registerForUserContextChange()
    }

  /**
  * This function is called to load all weather data from the server. The function 
  * waits until every data is loaded and calls afterwards the reloadTiles() function
  * of this service. 
  */  
  private loadWeatherData(): void {
    this.oldestHistoryDate = Date.now();
    
    let outDoorWeather = this.weatherAPIService.loadOutdoorWeather()
    let pollen = this.weatherAPIService.loadPollen()
    let forecast = this.weatherAPIService.loadForecast()
    let history = this.loadMonthFromHistory(new Date(this.oldestHistoryDate));
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

  /**
  * For the adaptive order of the dashboard tiles, it is needed to listen for
  * user context changes. E.g. if the user selects another pollen, then 
  */  
  private registerForUserContextChange(): void {
    this.userContextService.getUserContextSubject().subscribe(() => {
      this.reloadTiles()
    })
  }

  /**
  * This function creates the important tile arrays which are shown on the dashboard.
  * Every time this function is called, the createTiles() function of the tiles service is
  * called and afterward it will trigger the behaviour subjects to reload.
  */  
  public reloadTiles(): void {
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

  /**
  * Public function to load new data from the network
  */  
  public reloadData(): void {
    this.loadWeatherData();
  }

  /**
  * Public function to lazy load more history data. It uses the stored oldestHistoryDate 
  * to load one more month before this date.
  */  
  public loadMoreHistoryData(): Observable<WeatherHistoryData> {
    let observable = this.loadMonthFromHistory(new Date(this.oldestHistoryDate));
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

  /**
  * Helper function to load one more month of history data 
  * 
  * @returns history data from the server
  */  
  private loadMonthFromHistory(oldestHistoryDate: Date): Observable<WeatherHistoryData> {
    let fromDate = new Date(oldestHistoryDate);
    let toDate: Date;
    if(oldestHistoryDate.getMonth() < 1) {
      this.oldestHistoryDate = oldestHistoryDate.setFullYear(oldestHistoryDate.getFullYear() - 1);
      this.oldestHistoryDate = oldestHistoryDate.setMonth(11);
    } else {
      this.oldestHistoryDate = oldestHistoryDate.setMonth(oldestHistoryDate.getMonth() - 1);
    }
    toDate = new Date(this.oldestHistoryDate);
    return this.weatherAPIService.loadHistoryDataSubject(fromDate, toDate)
  }

  /**
  * @returns the behavior subject of the dashboard tiles 
  */  
  public getDashboardTilesSubject(): BehaviorSubject<Tile<WeatherData>[]>{
    return this._dashboardTiles;
  }  

  /**
  * @returns the behavior subject of the outdoor weahter
  */  
  public getOutdoorWeatherDataSubject(): BehaviorSubject<OutdoorWeatherData | undefined> {
    return this._outdoorWeatherData
  }

  /**
  * @returns the behavior subject of the hsitory data
  */  
  public getHistoryDataSubject(): BehaviorSubject<WeatherHistoryData | undefined> {
    return this._historyData;
  }

  /**
  * @returns the behavior subject of the forecast data
  */  
  public getForecastDataSubject(): BehaviorSubject<WeatherForecastData | undefined> {
    return this._forecastData;
  }

  /**
  * @returns the behavior subject of the indoor tiles
  */  
  public getIndoorTilesSubject() : BehaviorSubject<Tile<WeatherData>[]>{
    return this._indoorRoomTiles
  }

  /**
  * @returns the behavior subject of the pollen tiles array
  */  
  public getPollenTilesSubject(): BehaviorSubject<Tile<WeatherData>[]>{
    return this._pollenTiles
  } 
}
