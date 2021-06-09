import { Component, OnInit } from '@angular/core';
import { WeatherData } from 'src/app/model/weather';
import { TextService } from 'src/app/services/text.service';
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
  ttsTextGeneratorFunction = () => this.textService.createTextFromTilesArray(this.pollenTiles)


  constructor(private weatherDataService: WeatherDataService,
    private textService: TextService) { }

  ngOnInit(): void {
    this.loadPollenTiles();
  }

  private loadPollenTiles(): void {
    this.weatherDataService.getPollenTilesSubject().subscribe(data => this.pollenTiles = data);
  }

}
