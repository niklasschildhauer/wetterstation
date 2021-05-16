import { Component, OnInit } from '@angular/core';
import { Tile, TileType, WeatherData } from 'src/app/model/weather';
import { UserContextService } from 'src/app/services/user-context.service';
import { TileService } from 'src/app/services/tile.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';


@Component({
  selector: 'app-dashboard-screen',
  templateUrl: './dashboard-screen.component.html',
  styleUrls: ['./dashboard-screen.component.scss']
})
export class DashboardScreenComponent implements OnInit {
  reduceMotion: boolean = false;
  dashboardTiles?: Tile<WeatherData>[];
  tileType = TileType;
  desktop: boolean = false;

  constructor(private userContextService: UserContextService,
    private tileService: TileService,
    private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.loadReduceMotionValue();
    this.loadDashboardTiles();
    this.desktopBreakpointObserver();
  }

  private desktopBreakpointObserver() {
    this.breakpointObserver
    .observe(['(min-width: 770px)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.desktop = true;
      } else {
        this.desktop = false;
      }
    });
  }

  loadReduceMotionValue() {
    this.userContextService.getUserContext()
    .subscribe(data => {
      let reduceMotionValue = data.reduceMotion;
      this.reduceMotion = reduceMotionValue;
    });
  }

  loadDashboardTiles(): void {
    this.tileService.getDashboardTiles()
                      .subscribe(data => {
                        this.dashboardTiles = data});
  }

  reloadData(): void {
    this.tileService.reloadData();
  }
}
