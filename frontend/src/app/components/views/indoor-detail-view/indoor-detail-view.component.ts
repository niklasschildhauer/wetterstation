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
  ttsTextGeneratorFunction = () => this.textService.createTextFromTilesArray(this.indoorRoomTiles)

  constructor(private weatherDataService: WeatherDataService,
    private textService: TextService) { }

  ngOnInit(): void {
    this.loadIndoorRoomData();
  }

  loadIndoorRoomData() {
    this.weatherDataService.getIndoorTiles()
                        .subscribe(data => this.indoorRoomTiles = data);
  }

}
