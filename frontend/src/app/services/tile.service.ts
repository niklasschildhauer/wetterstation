import { Injectable, OnInit } from '@angular/core';
import { UserContextDelegte, UserContextService } from './user-context.service';
import { WeatherService } from './weather.service';
import { WeatherData, Tile, PollenData, TileType, IndoorRoomData, WeatherForecastData, TilePriority, WeatherHistoryData, WeatherGraphDataSet, OutdoorWeatherData } from '../model/weather';
import { Observable, of } from 'rxjs';
import { HistoryTileService } from './history-tile.service';
import { Pollen } from '../model/user-context';

@Injectable({
  providedIn: 'root'
})
export class TileService implements UserContextDelegte {
  private _dashboardTiles: Tile<WeatherData>[] = [];
  private _pollenTiles: Tile<WeatherData>[] = [];

  private _pollenData?: PollenData[];
  private _indoorRoomsData?: IndoorRoomData[];
  private _forecastData?: WeatherForecastData;
  private _historyData?: WeatherHistoryData;
  private _outdoorWeatherData?: OutdoorWeatherData;

  constructor(private weatherService: WeatherService, 
    private userContextService: UserContextService,
    private historyTileService: HistoryTileService) { 
      this.loadWeatherData();
      this.reloadTiles();
      this.userContextService.delegate = this
  }

  // NETWORK ACCESS
  private loadWeatherData() {
    this.weatherService.getOutdoorWeather().subscribe(data => {
      this._outdoorWeatherData = data;
      this.createOutdoorWeatherTiles(this._outdoorWeatherData);
    });
    this.weatherService.getPollen().subscribe(data => {
      this._pollenData = data;
      this.createPollenTiles(this._pollenData);
    });
    this.weatherService.getForecastData().subscribe(data => {
      this._forecastData = data;
      this.createForecastTile(this._forecastData);
    });
    this.weatherService.getHistoryData().subscribe(data => {
      this._historyData = data;
      this.createHistoryTile(this._historyData);
    });
    this.weatherService.getIndoorRoomData().subscribe(data => {
      this._indoorRoomsData = data;
      this.createIndoorRoomTiles(this._indoorRoomsData);
    });
  }

  private reloadTiles() {
    this._dashboardTiles = [];
    this._pollenTiles = [];

    if(this._pollenData) {
      this.createPollenTiles(this._pollenData);
    }
    if(this._indoorRoomsData) {
      this.createIndoorRoomTiles(this._indoorRoomsData);
    }
    if(this._forecastData) {
      this.createForecastTile(this._forecastData);
    }
    if(this._historyData) {
      this.createHistoryTile(this._historyData);
    }
    if(this._outdoorWeatherData) {
      this.createOutdoorWeatherTiles(this._outdoorWeatherData);
    }
  }

  reloadData(): void {
    this._dashboardTiles = [];
    this._pollenTiles = [];
    this.loadWeatherData();
  }

  private createOutdoorWeatherTiles(data: OutdoorWeatherData): void {
    let humidityTile: Tile<OutdoorWeatherData> = {
      type: TileType.humidity,
      data: data,
      id: "humidity",
      priority: this.getPrioritiyOf(data, TileType.humidity),
    }

    let apparentTemperatureTile: Tile<OutdoorWeatherData> = {
      type: TileType.apparentTemperature,
      data: data,
      id: "apparentTemperature",
      priority: this.getPrioritiyOf(data, TileType.apparentTemperature),
    }

    this.addOrReplaceTileTo(this._dashboardTiles, humidityTile);
    this.addOrReplaceTileTo(this._dashboardTiles, apparentTemperatureTile);
  }
  
  private createPollenTiles(data: PollenData[]): void {
    let preferredPollen: Pollen[] = this.userContextService.pollen
    let pollenData = data
    if(preferredPollen.length > 0) {
      preferredPollen.forEach(item => {
        let pollenItem = pollenData.find(dataItem => dataItem.type == item)
        if (pollenItem) {
          let smallTile: Tile<PollenData> = {
            type: TileType.pollenSmall,
            data: pollenItem,
            id: pollenItem.name,
            priority: this.getPrioritiyOf(pollenItem, TileType.pollenSmall),
          }
          this.addOrReplaceTileTo(this._dashboardTiles, smallTile);
          this.addOrReplaceTileTo(this._pollenTiles, smallTile);
          pollenData = pollenData.filter((item) => pollenItem != item);
        }
      });
    }
    
    let listTile: Tile<PollenData[]> = {
      type: TileType.pollenList,
      data: pollenData,
      id: "pollenlist",
      priority: this.getPrioritiyOf(pollenData, TileType.pollenList),
    }
    this.addOrReplaceTileTo(this._pollenTiles, listTile);

    if(preferredPollen.length == 0) {
      this.addOrReplaceTileTo(this._dashboardTiles, listTile);
    }
  }

  private createForecastTile(data: WeatherForecastData): void {
    let tile: Tile<WeatherForecastData> = {
      type: TileType.forecast,
      data: data,
      id: "forecast",
      priority: this.getPrioritiyOf(data, TileType.forecast),
    }
    this.addOrReplaceTileTo(this._dashboardTiles, tile);
  }

  private createHistoryTile(data: WeatherHistoryData): void {
    let dataHoursPerDay = this.historyTileService.getHistoryDataSetHoursPerDayFrom(data);
    let tile: Tile<WeatherGraphDataSet> = {
      type: TileType.history,
      data: dataHoursPerDay[0], // FIXME: not sage here 
      id: "history",
      priority: this.getPrioritiyOf(data, TileType.history),
    }
    this.addOrReplaceTileTo(this._dashboardTiles, tile);
  }

  private createIndoorRoomTiles(data: IndoorRoomData[]): void {
    for (let item of data) {
      let tile: Tile<IndoorRoomData> = {
        type: TileType.indoorRoom,
        data: item,
        id: item.roomID,
        priority: this.getPrioritiyOf(item, TileType.indoorRoom),
      }
      this.addOrReplaceTileTo(this._dashboardTiles, tile);
    }
  }

  private getPrioritiyOf(data: WeatherData, type: TileType): TilePriority {
    switch (type) {
      case TileType.indoorRoom: {
        let room = data as IndoorRoomData
        if (room.airQuality > 70) {
          return TilePriority.important 
        }
        return TilePriority.low
        // FIXME: Implement algorithm
      }
      case TileType.pollenList: {
        return TilePriority.low
        // FIXME: Implement algorithm
      }
      case TileType.pollenSmall: {
        let pollen = data as PollenData
        console.log(pollen);
        if (pollen.today > 2) {
          return TilePriority.high
        }
        if (pollen.today >= 1) {
          return TilePriority.middle
        }
        return TilePriority.low
        // FIXME: Implement algorithm
      }
      case TileType.forecast: {
        return TilePriority.middle
        // FIXME: Implement algorithm
      }
      case TileType.history: {
        return TilePriority.high
      }
    }
    return TilePriority.middle
  }

  private addOrReplaceTileTo(tilesArray: Tile<WeatherData>[], tile: Tile<WeatherData>) {
    var indexInTilesArray = this.getIndexOfTileIn(tilesArray, tile.id);

    if(indexInTilesArray > -1) {
      tilesArray[indexInTilesArray] = tile;
      return
    }
    tilesArray.push(tile);
    this.orderItemsIn(tilesArray);
  }

  private getIndexOfTileIn(tilesArray: Tile<WeatherData>[], id: string): number {
    return tilesArray.findIndex(element => element.id === id);
  }

  private orderItemsIn(tilesArray: Tile<WeatherData>[]): void {
    tilesArray.sort((a, b) => a.priority - b.priority);
  }

  getDashboardTiles(): Observable<Tile<WeatherData>[]>{
    let tiles = of(this._dashboardTiles);
    return tiles;
  }  

  getPollenTiles(): Observable<Tile<WeatherData>[]>{
    let tiles = of(this._pollenTiles);
    return tiles;
  }  

  // DELEGATE FUNCTION
  updatedUserContext(from: UserContextService): void {
    this.reloadData();
  }
}








