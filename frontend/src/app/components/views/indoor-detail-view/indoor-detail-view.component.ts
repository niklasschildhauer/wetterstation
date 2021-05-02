import { Component, OnInit } from '@angular/core';
import { IndoorRoomData } from 'src/app/model/weather';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-indoor-detail-view',
  templateUrl: './indoor-detail-view.component.html',
  styleUrls: ['./indoor-detail-view.component.scss']
})
export class IndoorDetailViewComponent implements OnInit {
  rooms?: IndoorRoomData[];
  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.loadIndoorRoomData();
  }

  loadIndoorRoomData() {
    this.weatherService.getIndoorRoomData()
                        .subscribe(data => this.rooms = data);
  }

}
