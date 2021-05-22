import { Component, OnInit } from '@angular/core';
import { Tile, WeatherData } from 'src/app/model/weather';
import { WeatherDataService } from 'src/app/services/weather-data.service';

@Component({
  selector: 'app-indoor-detail-view',
  templateUrl: './indoor-detail-view.component.html',
  styleUrls: ['./indoor-detail-view.component.scss']
})
export class IndoorDetailViewComponent implements OnInit {
  indoorRoomTiles?: Tile<WeatherData>[];

  constructor(private weatherDataService: WeatherDataService) { }

  ngOnInit(): void {
    this.loadIndoorRoomData();
  }

  loadIndoorRoomData() {
    this.weatherDataService.getIndoorTiles()
                        .subscribe(data => this.indoorRoomTiles = data);
  }

}
