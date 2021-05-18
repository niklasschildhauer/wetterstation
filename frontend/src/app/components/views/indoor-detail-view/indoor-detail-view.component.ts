import { Component, OnInit } from '@angular/core';
import { Tile, WeatherData } from 'src/app/model/weather';
import { TileService } from 'src/app/services/tile.service';

@Component({
  selector: 'app-indoor-detail-view',
  templateUrl: './indoor-detail-view.component.html',
  styleUrls: ['./indoor-detail-view.component.scss']
})
export class IndoorDetailViewComponent implements OnInit {
  indoorRoomTiles?: Tile<WeatherData>[];
  constructor(private tileService: TileService) { }

  ngOnInit(): void {
    this.loadIndoorRoomData();
  }

  loadIndoorRoomData() {
    this.tileService.getIndoorTiles()
                        .subscribe(data => this.indoorRoomTiles = data);
  }

}
