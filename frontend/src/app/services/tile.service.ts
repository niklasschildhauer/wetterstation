import { Injectable, OnInit } from '@angular/core';
import { UserContextService } from './user-context.service';
import { WeatherService } from './weather.service';
import { WeatherData, Tile, PollenData, TileType, IndoorRoomData, WeatherForecastData, TilePriority } from '../model/weather';
import { Observable, of } from 'rxjs';
import { tick } from '@angular/core/testing';


@Injectable({
  providedIn: 'root'
})
export class TileService {
  private _dashboardTiles: Tile<WeatherData>[] = [];
  private _pollenTiles: Tile<WeatherData>[] = [];

  constructor(private weatherService: WeatherService, 
    private userContextService: UserContextService) { 
      this.loadTiles();
  }

  private loadTiles() {
    this.loadPollenTiles();
    this.loadIndoorRoomTiles();
    this.loadForecastTile();
  }

  reloadData(): void {
    this.loadTiles();
  }
  
  private loadPollenTiles(): void {
    this.weatherService.getPollen().subscribe(data => {
      let tile: Tile<PollenData[]> = {
        type: TileType.pollenList,
        data: data,
        id: "pollenlist",
        priority: this.getPrioritiyOf(data, TileType.pollenList),
      }
      //HACK IS COMING
      this.addOrReplaceTileTo(this._dashboardTiles, tile);
      this.addOrReplaceTileTo(this._pollenTiles, tile);
      let smallTile: Tile<PollenData> = {
        type: TileType.pollenSmall,
        data: data[0],
        id: data[0].name,
        priority: TilePriority.middle,
      }
      this.addOrReplaceTileTo(this._dashboardTiles, smallTile);
      this.addOrReplaceTileTo(this._pollenTiles, smallTile);
      let smallTile2: Tile<PollenData> = {
        type: TileType.pollenSmall,
        data: data[1],
        id: data[1].name,
        priority: TilePriority.middle,
      }
      this.addOrReplaceTileTo(this._dashboardTiles, smallTile2);
      this.addOrReplaceTileTo(this._pollenTiles, smallTile2);
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
        console.log(data);
        if (room.airQuality > 70) {
          return TilePriority.important 
        }
        return TilePriority.low
        // FIXME: Implement algorithm
      }
      case TileType.pollenList: {
        return TilePriority.high
        // FIXME: Implement algorithm
      }
      case TileType.pollenSmall: {
        let pollen = data as PollenData
        if(pollen.name === "Esche") {
          return TilePriority.important; 
        }

        return TilePriority.middle
        // FIXME: Implement algorithm
      }
      case TileType.forecast: {
        return TilePriority.middle
        // FIXME: Implement algorithm
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








