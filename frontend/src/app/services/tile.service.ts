import { Injectable } from '@angular/core';
import { UserContextService } from './user-context.service';
import { WeatherData, Tile, PollenData, TileType, IndoorRoomData, WeatherForecastData, TilePriority, WeatherHistoryData, GraphDataSet, OutdoorWeatherData, TileArrays } from '../model/weather';
import { HistoryTileService } from './history-tile.service';

/**
 * Tile service injectable
 * 
 * Use this service to create the tile arrays which are used in the dashboard screen component
 * and the pollen detail component and the indoor room detail component to show the tiles in 
 * an order way based on the user context. 
 */
@Injectable({
  providedIn: 'root'
})
export class TileService  {
  constructor(private userContextService: UserContextService,
              private historyTileService: HistoryTileService) { }

  /**
   * Use this function to get an ordered tiles array based on the current user context.
   * In this way you can easily show the different tiles orderd by relevance. 
   * 
   * @param {OutdoorWeatherData} outdoorWeather
   * @param {PollenData[]} pollen
   * @param {WeatherForecastData} forecast
   * @param {WeatherHistoryData} history
   * @param {IndoorRoomData[]} indoorRoom
   * @returns A TilesArrays object which contains the three tiles array for dashboard screen, pollen detail and indoor room detail components. 
   */
  createTiles(outdoorWeather: OutdoorWeatherData | undefined, 
              pollen: PollenData[], 
              forecast: WeatherForecastData | undefined, 
              history: WeatherHistoryData | undefined, 
              indoorRoom: IndoorRoomData[]): TileArrays {
      let dashboardTiles: Tile<WeatherData>[] = []
      let pollenTiles: Tile<WeatherData>[] = []
      let indoorRoomTiles: Tile<WeatherData>[] = []

      if(outdoorWeather)
      this.createOutdoorWeatherTiles(outdoorWeather, dashboardTiles);
      if(forecast)
      this.createForecastTile(forecast, dashboardTiles)
      if(history)
      this.createHistoryTile(history, dashboardTiles)
      this.createIndoorRoomTiles(indoorRoom, dashboardTiles, indoorRoomTiles)
      this.createPollenTiles(pollen, dashboardTiles, pollenTiles)
      return {
        dashboard: dashboardTiles,
        pollen: pollenTiles,
        indoorRooms: indoorRoomTiles
      }
  }

  /**
   * Create outdoor weather tiles and add them to the dashboard tiles array  
   * 
   * @param {OutdoorWeatherData} data
   * @param {Tile<WeatherData>[]} dashboard
   */
  private createOutdoorWeatherTiles(data: OutdoorWeatherData, dashboard: Tile<WeatherData>[]): void {
    let humidityTile: Tile<OutdoorWeatherData> = {
      type: TileType.humidity,
      data: data,
      id: 'humidity',
      priority: this.getPrioritiyOf(data, TileType.humidity),
    }

    let apparentTemperatureTile: Tile<OutdoorWeatherData> = {
      type: TileType.apparentTemperature,
      data: data,
      id: 'apparentTemperature',
      priority: this.getPrioritiyOf(data, TileType.apparentTemperature),
    }

    this.addTileTo(dashboard, humidityTile);
    this.addTileTo(dashboard, apparentTemperatureTile);
  }
  
  /**
   * Create pollen tiles and add them to the dashboard tiles array and pollen tiles array
   * 
   * @param {PollenData[]} data
   * @param {Tile<WeatherData>[]} dashboard  The dashboard tiles array 
   * @param {Tile<WeatherData>[]} pollen  The pollen tiles array 
   */
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
      id: 'pollenlist',
      priority: this.getPrioritiyOf(pollenData, TileType.pollenList),
    }
    this.addTileTo(pollen, listTile);

    if(preferredPollen.length == 0) {
      this.addTileTo(dashboard, listTile);
    }
  }

  /**
   * Create forecast tile and add them to the dashboard tiles array  
   * 
   * @param {WeatherForecastData} data 
   * @param {Tile<WeatherData>[]} dashboard  The dashboard tiles array 
   */
  private createForecastTile(data: WeatherForecastData, dashboard: Tile<WeatherData>[]): void {
    let tile: Tile<WeatherForecastData> = {
      type: TileType.forecast,
      data: data,
      id: 'forecast',
      priority: this.getPrioritiyOf(data, TileType.forecast),
    }
    this.addTileTo(dashboard, tile);
  }

  /**
   * Create weather history tile and add them to the dashboard tiles array  
   * 
   * @param {WeatherHistoryData} data
   * @param {Tile<WeatherData>[]} dashboard  The dashboard tiles array 
   */
  private createHistoryTile(data: WeatherHistoryData, dashboard: Tile<WeatherData>[]): void {
    let dataHoursPerDay = this.historyTileService.getHistoryDataSetHoursPerDayFrom(data);
    let tile: Tile<GraphDataSet> = {
      type: TileType.history,
      data: dataHoursPerDay[0], // FIXME: not sage here 
      id: 'history',
      priority: this.getPrioritiyOf(data, TileType.history),
    }
    this.addTileTo(dashboard, tile);
  }

  /**
   * Create indoor room tiles and add them to the dashboard tiles array and indoor room tiles array
   * 
   * @param {PollenData[]} data
   * @param {Tile<WeatherData>[]} dashboard  The dashboard tiles array 
   * @param {Tile<WeatherData>[]} indoorRoom  The indoor room tiles array 
   */
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

  /**
   * Private function to calculate the current prioritiy of a tile. This prioritiy is used after
   * to caculate the order of the tiles. The higher the priority the lower should be the index of the 
   * tile in the tiles array.
   * 
   * @param {WeatherData} data  The parent interface of all weather data interfaces.  
   * @param {TileType} type  The parent interface of all weather data interfaces.  
   */
  private getPrioritiyOf(data: WeatherData, type: TileType): TilePriority {
    switch (type) {
      case TileType.indoorRoom: {
        let room = data as IndoorRoomData
        if (room.airQuality - 5 > room.calibrationValue) {
          return TilePriority.important 
        }
        if (room.airQuality > room.calibrationValue - 5) {
          return TilePriority.middle 
        }
        return TilePriority.low
      }
      case TileType.pollenList: {
        return TilePriority.low
      }
      case TileType.pollenSmall: {
        let pollen = data as PollenData
        if (pollen.today === '0' || pollen.today === '-1') {
          return TilePriority.low
        }
        if (pollen.today === '2-3' || pollen.today === '3' || pollen.today === '3-4') {
          return TilePriority.important
        }
        return TilePriority.middle
      }
      case TileType.forecast: {
        return TilePriority.middle
      }
      case TileType.history: {
        return TilePriority.low
      }
    }
    return TilePriority.low
  }

  /**
   * Helper function 
   */
  private addTileTo(tilesArray: Tile<WeatherData>[], tile: Tile<WeatherData>) {
    tilesArray.push(tile);
    this.orderItemsIn(tilesArray);
  }

  /**
   * Helper function 
   */
  private addOrReplaceTileTo(tilesArray: Tile<WeatherData>[], tile: Tile<WeatherData>) {
    let indexInTilesArray = this.getIndexOfTileIn(tilesArray, tile.id);

    if(indexInTilesArray > -1) {
      tilesArray[indexInTilesArray] = tile;
      return
    }
    tilesArray.push(tile);
    this.orderItemsIn(tilesArray);
  }

  /**
   * Helper function 
   */
  private getIndexOfTileIn(tilesArray: Tile<WeatherData>[], id: string): number {
    return tilesArray.findIndex(element => element.id === id);
  }

  /**
   * Helper function 
   */
  private orderItemsIn(tilesArray: Tile<WeatherData>[]): void {
    tilesArray.sort((a, b) => a.priority - b.priority);
  }
}








