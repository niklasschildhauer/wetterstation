import { Injectable } from '@angular/core';
import { UserContextService } from './user-context.service';
import { WeatherData, Tile, PollenData, TileType, IndoorRoomData, WeatherForecastData, TilePriority, WeatherHistoryData, GraphDataSet, OutdoorWeatherData } from '../model/weather';
import { HistoryTileService } from './history-tile.service';

export interface TileArrays {
  dashboard: Tile<WeatherData>[],
  pollen : Tile<WeatherData>[],
  indoorRooms: Tile<WeatherData>[]
}

@Injectable({
  providedIn: 'root'
})
export class TileService  {
  constructor( 
    private userContextService: UserContextService,
    private historyTileService: HistoryTileService) { }

  createTiles(outdoorWeather: OutdoorWeatherData, 
    pollen: PollenData[], 
    forecast: WeatherForecastData, 
    history: WeatherHistoryData, 
    indoorRoom: IndoorRoomData[]): TileArrays {
      var dashboardTiles: Tile<WeatherData>[] = []
      var pollenTiles: Tile<WeatherData>[] = []
      var indoorRoomTiles: Tile<WeatherData>[] = []

      this.createOutdoorWeatherTiles(outdoorWeather, dashboardTiles);
      this.createForecastTile(forecast, dashboardTiles)
      this.createHistoryTile(history, dashboardTiles)
      this.createIndoorRoomTiles(indoorRoom, dashboardTiles, indoorRoomTiles)
      this.createPollenTiles(pollen, dashboardTiles, pollenTiles)
      return {
        dashboard: dashboardTiles,
        pollen: pollenTiles,
        indoorRooms: indoorRoomTiles
      }
  }

  private createOutdoorWeatherTiles(data: OutdoorWeatherData, dashboard: Tile<WeatherData>[]): void {
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

    this.addTileTo(dashboard, humidityTile);
    this.addTileTo(dashboard, apparentTemperatureTile);
  }
  
  private createPollenTiles(data: PollenData[], dashboard: Tile<WeatherData>[], pollen: Tile<WeatherData>[]): void {
    let preferredPollen: string[] = this.userContextService.pollen
    let pollenData = data

    if(preferredPollen.length > 0) {
      preferredPollen.forEach(item => {
        let pollenItem = pollenData.find(dataItem => dataItem.pollenName == item)
        if (pollenItem) {
          let smallTile: Tile<PollenData> = {
            type: TileType.pollenSmall,
            data: pollenItem,
            id: pollenItem.pollenName,
            priority: this.getPrioritiyOf(pollenItem, TileType.pollenSmall),
          }
          this.addTileTo(dashboard, smallTile);
          this.addTileTo(pollen, smallTile);
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
    this.addTileTo(pollen, listTile);

    if(preferredPollen.length == 0) {
      this.addTileTo(dashboard, listTile);
    }
  }

  private createForecastTile(data: WeatherForecastData, dashboard: Tile<WeatherData>[]): void {
    let tile: Tile<WeatherForecastData> = {
      type: TileType.forecast,
      data: data,
      id: "forecast",
      priority: this.getPrioritiyOf(data, TileType.forecast),
    }
    this.addTileTo(dashboard, tile);
  }

  private createHistoryTile(data: WeatherHistoryData, dashboard: Tile<WeatherData>[]): void {
    let dataHoursPerDay = this.historyTileService.getHistoryDataSetHoursPerDayFrom(data);
    let tile: Tile<GraphDataSet> = {
      type: TileType.history,
      data: dataHoursPerDay[0], // FIXME: not sage here 
      id: "history",
      priority: this.getPrioritiyOf(data, TileType.history),
    }
    this.addTileTo(dashboard, tile);
  }

  private createIndoorRoomTiles(data: IndoorRoomData[], dashboard: Tile<WeatherData>[], indoorRoom: Tile<WeatherData>[]): void {
    for (let item of data) {
      let tile: Tile<IndoorRoomData> = {
        type: TileType.indoorRoom,
        data: item,
        id: item.roomID,
        priority: this.getPrioritiyOf(item, TileType.indoorRoom),
      }
      this.addTileTo(dashboard, tile);
      this.addTileTo(indoorRoom, tile);
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
        return TilePriority.low
      }
    }
    return TilePriority.middle
  }

  private addTileTo(tilesArray: Tile<WeatherData>[], tile: Tile<WeatherData>) {
    tilesArray.push(tile);
    this.orderItemsIn(tilesArray);
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
}








