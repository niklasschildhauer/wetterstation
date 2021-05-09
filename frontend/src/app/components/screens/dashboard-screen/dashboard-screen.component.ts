import { Component, OnInit } from '@angular/core';
import { IndoorRoomData, Tile, TileType, WeatherData } from 'src/app/model/weather';
import { WeatherService } from 'src/app/services/weather.service';
import { UserContextService } from 'src/app/services/user-context.service';
import { TileService } from 'src/app/services/tile.service';


@Component({
  selector: 'app-dashboard-screen',
  templateUrl: './dashboard-screen.component.html',
  styleUrls: ['./dashboard-screen.component.scss']
})
export class DashboardScreenComponent implements OnInit {
  // TEMP -> Muss geändert werden
  indoorRooms?: IndoorRoomData[];
  reduceMotion: boolean = false;
  dashboardTiles?: Tile<WeatherData>[];
  tileType = TileType;

  constructor(private weatherService: WeatherService,
    private userContextService: UserContextService,
    private tileService: TileService) { }

  ngOnInit(): void {
    this.loadIndoorRooms();
    this.loadReduceMotionValue();
    this.loadDashboardTiles();
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

  loadDashboardTiles(): void {
    this.tileService.getDashboardTiles()
                      .subscribe(data => {
                        this.dashboardTiles = data
                        console.log(this.dashboardTiles)});
  }

  reloadData(): void {
    this.tileService.reloadData();
  }
}
