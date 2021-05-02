import { Component, OnInit } from '@angular/core';
import { IndoorRoomData } from 'src/app/model/weather';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-dashboard-screen',
  templateUrl: './dashboard-screen.component.html',
  styleUrls: ['./dashboard-screen.component.scss']
})
export class DashboardScreenComponent implements OnInit {
  // TEMP -> Muss geändert werden
  indoorRooms?: IndoorRoomData[];
  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.loadIndoorRooms();
  }

  loadIndoorRooms(): void {
    this.weatherService.getIndoorRoomData()
                      .subscribe(data => {
                        this.indoorRooms = data
                        console.log(this.indoorRooms)});
  }

}
