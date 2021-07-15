import { Component, OnInit } from '@angular/core';
import { WeatherData } from 'src/app/model/weather';
import { TextService } from 'src/app/services/text.service';
import { WeatherDataService } from 'src/app/services/weather-data.service';
import { Tile, TileType } from '../../../model/weather';

/**
 * Pollenflug detail view component 
 * 
 * This component displays the pollen data. It displays the 
 * information by using the pollen tile view and pollen small tile view.
 * The pollen small tile view is dynamically choosen if the user has 
 * an allergy to the polle. @Carina
 */
@Component({
  selector: 'app-pollenflug-detail-view',
  templateUrl: './pollenflug-detail-view.component.html',
  styleUrls: ['./pollenflug-detail-view.component.scss']
})
export class PollenflugDetailViewComponent implements OnInit {
  pollenTiles?: Tile<WeatherData>[]
  tileType = TileType;
  /**
   * this function computes the to be read aloud text for the tts feature. 
   * This function is passed to the tts player element
   */
  ttsTextGeneratorFunction = () => this.textService.createTextFromTilesArray(this.pollenTiles)

  constructor(private weatherDataService: WeatherDataService,
    private textService: TextService) { }

  ngOnInit(): void {
    this.loadPollenTiles();
  }

  /**
   * Subscribes to the pollen tiles array. 
   */
  private loadPollenTiles(): void {
    this.weatherDataService.getPollenTilesSubject().subscribe(data => this.pollenTiles = data);
  }

}
