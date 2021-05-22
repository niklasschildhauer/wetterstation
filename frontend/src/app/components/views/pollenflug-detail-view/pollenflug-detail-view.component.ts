import { Component, OnInit } from '@angular/core';
import { WeatherData } from 'src/app/model/weather';
import { WeatherDataService } from 'src/app/services/weather-data.service';
import { Tile, TileType } from '../../../model/weather';

@Component({
  selector: 'app-pollenflug-detail-view',
  templateUrl: './pollenflug-detail-view.component.html',
  styleUrls: ['./pollenflug-detail-view.component.scss']
})
export class PollenflugDetailViewComponent implements OnInit {
  pollenTiles?: Tile<WeatherData>[]
  tileType = TileType;


  constructor(private weatherDataService: WeatherDataService) { }

  ngOnInit(): void {
    this.loadPollenTiles();
  }

  private loadPollenTiles(): void {
    this.weatherDataService.getPollenTiles().subscribe(data => this.pollenTiles = data);
  }

}
