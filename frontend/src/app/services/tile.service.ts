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

  constructor(private weatherService: WeatherService, 
    private userContextService: UserContextService,
    private historyTileService: HistoryTileService) { 
      this.loadTiles();
      this.userContextService.delegate = this
  }

  private loadTiles() {
    this.loadPollenTiles();
    this.loadIndoorRoomTiles();
    this.loadForecastTile();
    this.loadHistoryTile();
    this.loadOutdoorWeatherTiles();
  }

  reloadData(): void {
    this._dashboardTiles = [];
    this._pollenTiles = [];
    this.loadTiles();
  }

  updatedUserContext(from: UserContextService): void {
    console.log("hier drinnen");
    this.reloadData();
  }

  private loadOutdoorWeatherTiles(): void {
    this.weatherService.getOutdoorWeather().subscribe(data => {
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
    })
  }
  
  private loadPollenTiles(): void {
    this.weatherService.getPollen().subscribe(data => {
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
    })
  }

  private loadForecastTile(): void {
    this.weatherService.getForecastData().subscribe(data => {
      let tile: Tile<WeatherForecastData> = {
        type: TileType.forecast,
        data: data,
        id: "forecast",
        priority: this.getPrioritiyOf(data, TileType.forecast),
      }
      this.addOrReplaceTileTo(this._dashboardTiles, tile);
    })
  }

  private loadHistoryTile(): void {
    this.weatherService.getHistoryData().subscribe(data => {
      let dataHoursPerDay = this.historyTileService.getHistoryDataSetHoursPerDayFrom(data);
      let tile: Tile<WeatherGraphDataSet> = {
        type: TileType.history,
        data: dataHoursPerDay[0], // FIXME: not sage here 
        id: "history",
        priority: this.getPrioritiyOf(data, TileType.history),
      }
      this.addOrReplaceTileTo(this._dashboardTiles, tile);
    })
  }

  private loadIndoorRoomTiles(): void {
    this.weatherService.getIndoorRoomData().subscribe(data => {
      for (let item of data) {
        let tile: Tile<IndoorRoomData> = {
          type: TileType.indoorRoom,
          data: item,
          id: item.roomID,
          priority: this.getPrioritiyOf(item, TileType.indoorRoom),
        }
        this.addOrReplaceTileTo(this._dashboardTiles, tile);
      }
    })
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
}








