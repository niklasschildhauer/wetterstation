import { Component, OnInit } from '@angular/core';
import { OutdoorWeatherData, Tile, TileType, WeatherData } from 'src/app/model/weather';
import { UserContextService } from 'src/app/services/user-context.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { WeatherDataService } from 'src/app/services/weather-data.service';
import { TextService } from 'src/app/services/text.service';
import { NgxSpinnerService } from 'ngx-spinner';

/**
 * Dashboard view component
 * 
 * This component is one of the most important components in this
 * webapp. This component is responsible for the loading of the
 * dashboard tiles data. One of its properties are the dashboardTiles 
 * which are used by a switch to display the matching tile view (widget)
 */
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
  /**
   * this function computes the to be read aloud text for the tts feature. 
   * This function is passed to the tts player element
   */
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

  /**
   * Is needed to detect if the current device is
   * a desktop or mobile device. For desktop devices the
   * outdoor weather view is shown by the app component globally
   * and therefore there is no need to display it twice.
   */
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

  /**
   * This function loads the reduce motion value. This is needed
   * to turn on or off the motion of the outdoor weather view
   * component.
   */
   private loadReduceMotionValue() {
    this.userContextService.getUserContextSubject()
    .subscribe(data => {
      let reduceMotionValue = data.reduceMotion;
      this.reduceMotion = reduceMotionValue;
    });
  }

  /**
   * This function loads the needed data for the 
   * dashboard. These are the dashboard tiles array and
   * the outdoor weather data. For both the weather data
   * service is used. 
   * This function also shows and hides the loading spinner.
   */
   private loadData(): void {
    this.spinner.show()
    this.weatherDataService.getDashboardTilesSubject()
                      .subscribe(data => {
                        this.dashboardTiles = data
                        if (data.length > 0) {
                          this.spinner.hide();
                        }
                      });
    this.weatherDataService.getOutdoorWeatherDataSubject()
                        .subscribe(data => {
                          this.outdoorData = data});
  }
}
