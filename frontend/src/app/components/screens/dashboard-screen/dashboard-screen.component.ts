import { Component, OnInit } from '@angular/core';
import { IndoorRoomData } from 'src/app/model/weather';
import { WeatherService } from 'src/app/services/weather.service';
import { UserContextService } from 'src/app/services/user-context.service';


@Component({
  selector: 'app-dashboard-screen',
  templateUrl: './dashboard-screen.component.html',
  styleUrls: ['./dashboard-screen.component.scss']
})
export class DashboardScreenComponent implements OnInit {
  // TEMP -> Muss geändert werden
  indoorRooms?: IndoorRoomData[];
  reduceMotion: boolean = false;

  constructor(private weatherService: WeatherService,
    private userContextService: UserContextService) { }

  ngOnInit(): void {
    this.loadIndoorRooms();
    this.loadReduceMotionValue();
  }

  loadReduceMotionValue() {
    this.userContextService.getMotionPreference()
    .subscribe(data => this.reduceMotion = data);
  }

  loadIndoorRooms(): void {
    this.weatherService.getIndoorRoomData()
                      .subscribe(data => {
                        this.indoorRooms = data
                        console.log(this.indoorRooms)});
  }

}
