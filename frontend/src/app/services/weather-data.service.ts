import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { IndoorRoomData, OutdoorWeatherData, PollenData, Tile, WeatherData, WeatherForecastData, WeatherHistoryData } from '../model/weather';
import { TileService, TileArrays } from './tile.service';
import { UserContextDelegte, UserContextService } from './user-context.service';
import { WeatherAPIService } from './weather-api.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherDataService implements UserContextDelegte{
  private _dashboardTiles: Tile<WeatherData>[] = [];
  private _pollenTiles: Tile<WeatherData>[] = [];
  private _indoorRoomTiles: Tile<WeatherData>[]= [];

  private _pollenData?: PollenData[];
  private _indoorRoomsData?: IndoorRoomData[];
  private _forecastData?: WeatherForecastData;
  private _historyData?: WeatherHistoryData;
  private _outdoorWeatherData?: OutdoorWeatherData;

  constructor(private tileService: TileService,
    private weatherAPIService: WeatherAPIService,
    private userContextService: UserContextService) { 
      this.loadWeatherData();
      userContextService.delegate = this
    }
      // NETWORK ACCESS
  private loadWeatherData() {
    let outDoorWeather = this.weatherAPIService.getOutdoorWeather();
    let pollen = this.weatherAPIService.getPollen()
    let forecast = this.weatherAPIService.getForecastData()
    let history = this.weatherAPIService.getHistoryData()
    let indoorRoom = this.weatherAPIService.getIndoorRoomData()

    forkJoin([outDoorWeather, pollen, forecast, history, indoorRoom]).subscribe(results => {
      this._outdoorWeatherData = results[0]
      this._pollenData = results[1]
      this._forecastData = results[2]
      this._historyData = results[3]
      this._indoorRoomsData = results[4]

      this.reloadTiles();
    });
  }

  reloadTiles() {
    this.resetData();

    if(this._pollenData && this._indoorRoomsData && this._forecastData && this._historyData && this._outdoorWeatherData) {
      let result = this.tileService.createTiles(this._outdoorWeatherData, 
        this._pollenData, 
        this._forecastData, 
        this._historyData, 
        this._indoorRoomsData )

      this._dashboardTiles = result.dashboard
      this._pollenTiles = result.pollen
      this._indoorRoomTiles = result.indoorRooms
    }
  }

  private resetData() {
    this._dashboardTiles = [];
    this._pollenTiles = [];
    this._indoorRoomTiles = [];
  }

  reloadData(): void {
    this.loadWeatherData();
  }

  updatedUserContext(from: UserContextService): void {
    this.reloadData();
  }

  // Getter methods
  getDashboardTiles(): Observable<Tile<WeatherData>[]>{
    let tiles = of(this._dashboardTiles);
    return tiles;
  }  

  getIndoorTiles() : Observable<Tile<WeatherData>[]>{
    let tiles = of(this._indoorRoomTiles);
    return tiles;
  }

  getPollenTiles(): Observable<Tile<WeatherData>[]>{
    let tiles = of(this._pollenTiles);
    return tiles;
  } 

  getOutdoorWeatherData(): Observable<OutdoorWeatherData | undefined> {
    let data = of(this._outdoorWeatherData);
    return data
  }

  getForecastData(): Observable<WeatherForecastData | undefined> {
    let data = of(this._forecastData);
    return data
  }

  getHistoryData(): Observable<WeatherHistoryData | undefined> {
    let data = of(this._historyData);
    return data
  }
}
