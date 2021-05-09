import { Injectable } from '@angular/core';
import { UserContextService } from './user-context.service';
import { WeatherService } from './weather.service';
import { WeatherData, Tile } from '../model/weather';
import { Observable, of } from 'rxjs';
import { DASHBOARDTILES } from '../model/mock-data/weather.mock';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private weatherService: WeatherService, 
    private userContextService: UserContextService) { }

    getDashboardTiles(): Observable<Tile<WeatherData>[]>{
      const tiles = of(DASHBOARDTILES);
      return tiles;
    }  
}








