import { Component, Input, OnInit } from '@angular/core';
import { IndoorRoomData, WeatherData } from 'src/app/model/weather';

@Component({
  selector: 'app-indoor-tile-view',
  templateUrl: './indoor-tile-view.component.html',
  styleUrls: ['./indoor-tile-view.component.scss']
})
export class IndoorTileViewComponent implements OnInit {
  @Input()
  set data(data: WeatherData) {
    this._indoorRoom = data as IndoorRoomData;
  }
  @Input() pressable: boolean = false;
  @Input() hideSubtitle: boolean = false;
  _indoorRoom?: IndoorRoomData

  constructor() { }

  ngOnInit(): void { }
}


