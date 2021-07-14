import { Component, OnInit } from '@angular/core';
import { Tile, WeatherData } from 'src/app/model/weather';
import { TextService } from 'src/app/services/text.service';
import { WeatherDataService } from 'src/app/services/weather-data.service';

@Component({
  selector: 'app-indoor-detail-view',
  templateUrl: './indoor-detail-view.component.html',
  styleUrls: ['./indoor-detail-view.component.scss']
})
export class IndoorDetailViewComponent implements OnInit {
  indoorRoomTiles?: Tile<WeatherData>[];
  /**
   * this function computes the to be read aloud text for the tts feature. 
   * This function is passed to the tts player element
   */
  ttsTextGeneratorFunction = () => this.textService.createTextFromTilesArray(this.indoorRoomTiles)

  constructor(private weatherDataService: WeatherDataService,
    private textService: TextService) { }

  ngOnInit(): void {
    this.loadIndoorRoomData();
  }

  loadIndoorRoomData() {
    this.weatherDataService.getIndoorTilesSubject()
                        .subscribe(data => this.indoorRoomTiles = data);
  }

}
