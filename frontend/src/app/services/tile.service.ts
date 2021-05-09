import { Injectable, OnInit } from '@angular/core';
import { UserContextService } from './user-context.service';
import { WeatherService } from './weather.service';
import { WeatherData, Tile, PollenData, TileType, IndoorRoomData, WeatherForecastData } from '../model/weather';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TileService {
  private _dashboardTiles: Tile<WeatherData>[] = [];
  private _pollenTiles: Tile<WeatherData>[] = [];

  // THIS IMPLEMENTATION WILL CAUSE A BUG WHEN RELOADING!!
  constructor(private weatherService: WeatherService, 
    private userContextService: UserContextService) { 
      this.loadPollenTiles();
      this.loadIndoorRoomTiles();
      this.loadForecastTile();
  }
  
  private loadPollenTiles(): void {
    this.weatherService.getPollen().subscribe(data => {
      let tile: Tile<PollenData[]> = {
        type: TileType.pollenList,
        data: data
      }
      this._dashboardTiles.push(tile);
      this._pollenTiles.push(tile);
    })
  }

  private loadForecastTile(): void {
    this.weatherService.getForecastData().subscribe(data => {
      let tile: Tile<WeatherForecastData> = {
        type: TileType.forecast,
        data: data
      }
      this._dashboardTiles.push(tile);
    })
  }

  private loadIndoorRoomTiles(): void {
    this.weatherService.getIndoorRoomData().subscribe(data => {
      for (let item of data) {
        let tile: Tile<IndoorRoomData> = {
          type: TileType.indoorRoom,
          data: item
        }
        this._dashboardTiles.push(tile);
      }
    })
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








