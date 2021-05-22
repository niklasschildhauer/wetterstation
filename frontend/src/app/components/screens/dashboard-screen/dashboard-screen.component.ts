import { Component, OnInit } from '@angular/core';
import { Tile, TileType, WeatherData } from 'src/app/model/weather';
import { UserContextService } from 'src/app/services/user-context.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { reducePollen } from 'src/app/model/mock-data/weather.mock';
import { Router } from '@angular/router';
import { WeatherDataService } from 'src/app/services/weather-data.service';


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
    private weatherDataService: WeatherDataService,
    private breakpointObserver: BreakpointObserver,
    private router: Router) { }

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
    this.weatherDataService.getDashboardTiles()
                      .subscribe(data => {
                        this.dashboardTiles = data});
  }

  // DELETE ME?
  reloadComponent(): void {
    reducePollen();
    this.weatherDataService.reloadData();
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}
