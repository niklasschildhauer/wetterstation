import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PollenData, Tile, TileType, WeatherData } from 'src/app/model/weather';
import { UserContextService } from 'src/app/services/user-context.service';
import { TileService } from 'src/app/services/tile.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { reducePollen } from 'src/app/model/mock-data/weather.mock';
import { WeatherService } from 'src/app/services/weather.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard-screen',
  templateUrl: './dashboard-screen.component.html',
  styleUrls: ['./dashboard-screen.component.scss']
})
export class DashboardScreenComponent implements OnInit, OnChanges {
  reduceMotion: boolean = false;
  dashboardTiles?: Tile<WeatherData>[];
  tileType = TileType;
  desktop: boolean = false;

  pollen?: PollenData[];

  constructor(private userContextService: UserContextService,
    private tileService: TileService,
    private breakpointObserver: BreakpointObserver,
    private weatherService: WeatherService,
    private router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.tileService.reloadData();
  }

  ngOnInit(): void {
    this.loadReduceMotionValue();
    this.loadDashboardTiles();
    this.desktopBreakpointObserver();

    this.weatherService.getPollen().subscribe(data => this.pollen = data);
    
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

  reloadComponent(): void {
    reducePollen();
    this.tileService.reloadData();
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}
