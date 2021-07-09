import { Component, OnInit } from '@angular/core';
import { OutdoorWeatherData, Tile, TileType, WeatherData } from 'src/app/model/weather';
import { UserContextService } from 'src/app/services/user-context.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { WeatherDataService } from 'src/app/services/weather-data.service';
import { TextService } from 'src/app/services/text.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss']
})
export class DashboardViewComponent implements OnInit {
  reduceMotion: boolean = false;
  dashboardTiles?: Tile<WeatherData>[];
  outdoorData?: OutdoorWeatherData;
  tileType = TileType;
  desktop: boolean = false;
  ttsTextGeneratorFunction = () => {
    let tilesText = this.textService.createTextFromTilesArray(this.dashboardTiles);
    let outdoorText = this.textService.createOutdoorText(this.outdoorData);
    return outdoorText + tilesText;
  }

  constructor(private userContextService: UserContextService,
    private weatherDataService: WeatherDataService,
    private breakpointObserver: BreakpointObserver,
    private textService: TextService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.loadReduceMotionValue();
    this.loadData();
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
    this.userContextService.getUserContextSubject()
    .subscribe(data => {
      let reduceMotionValue = data.reduceMotion;
      this.reduceMotion = reduceMotionValue;
    });
  }

  loadData(): void {
    this.spinner.show()
    this.weatherDataService.getDashboardTilesSubject()
                      .subscribe(data => {
                        this.dashboardTiles = data
                        console.log("hide it")
                        if (data.length > 0) {
                          console.log("hide it")
                          this.spinner.hide();
                        }
                      });
    this.weatherDataService.getOutdoorWeatherDataSubject()
                        .subscribe(data => {
                          this.outdoorData = data});
  }
}
