import { Component, Input, OnInit } from '@angular/core';
import { IndoorRoomData } from 'src/app/model/weather';

@Component({
  selector: 'app-indoor-tile-view',
  templateUrl: './indoor-tile-view.component.html',
  styleUrls: ['./indoor-tile-view.component.scss']
})
export class IndoorTileViewComponent implements OnInit {
  @Input() indoorRoom?: IndoorRoomData;
  constructor() { }

  ngOnInit(): void {
  }

}
