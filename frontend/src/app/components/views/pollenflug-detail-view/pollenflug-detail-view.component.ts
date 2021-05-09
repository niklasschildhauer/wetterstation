import { Component, OnInit } from '@angular/core';
import { WeatherData } from 'src/app/model/weather';
import { TileService } from 'src/app/services/tile.service';
import { Tile, TileType } from '../../../model/weather';

@Component({
  selector: 'app-pollenflug-detail-view',
  templateUrl: './pollenflug-detail-view.component.html',
  styleUrls: ['./pollenflug-detail-view.component.scss']
})
export class PollenflugDetailViewComponent implements OnInit {
  pollenTiles?: Tile<WeatherData>[]
  tileType = TileType;


  constructor(private tileService: TileService) { }

  ngOnInit(): void {
    this.loadPollenTiles();
  }

  private loadPollenTiles(): void {
    this.tileService.getPollenTiles().subscribe(data => this.pollenTiles = data);
  }

}
