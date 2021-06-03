import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { ImageModel } from '../model/image';
import { Themes, UserContext } from '../model/user-context';
import { Daytime } from '../model/weather';
import { UserContextService } from './user-context.service';
import { WeatherDataService } from './weather-data.service';

/**
 * Image service injectable
 *
 * Use this service to get the full assets path of an image.
 */
@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private baseURLIcons = 'assets/icons/';
  private baseURLWeather = 'assets/weather/';
  private userContext?: UserContext;
  private systemTheme = Themes.Light;

  constructor(private userContextService: UserContextService,
              private breakpointObserver: BreakpointObserver,
              private weatherDataService: WeatherDataService) { 
    this.loadUserContext();
    this.systemThemeBreakpointObserver();
  }

  /**
   * Use this function to get the image src in the applied color scheme 
   * 
   * @param {ImageModel} imageModel  the image model of the prefered image
   * @returns The full assets path of the image in the applied color scheme
   */
  public getImageSrcFrom(imageModel: ImageModel): string {
    const userContextTheme = this.userContext?.theme
    switch(userContextTheme) {
      case Themes.Automatic: 
        if(this.systemTheme == Themes.Dark) {
          return this.baseURLIcons + imageModel.dark;
        } else {
          return this.baseURLIcons + imageModel.light;
        }
      case Themes.Dark: 
        return this.baseURLIcons + imageModel.dark;
      case Themes.Light: 
        return this.baseURLIcons + imageModel.light;
      case Themes.HighContrast: 
        return imageModel.highContrast ? this.baseURLIcons + imageModel.highContrast : this.baseURLIcons + imageModel.dark;
      default: return ''
    }
  }

  /**
   * Use this function to get the image src of the current weather icon
   * 
   * @param {weather} string  the current weather string
   * @returns The full assets path of the image
   */
   public getWeatherIconString(weather: string): string {
    let src = this.baseURLWeather;
    switch (this.weatherDataService.getDaytime()) {
      case Daytime.night: {
        src = src + 'night/' + weather + '.png';
        break;
      }
      default: {
        src = src + 'day/' + weather + '.png';
      }
    }
    return src
  }

  /**
  * Observe the system color scheme for changes
  */
  private systemThemeBreakpointObserver() {
    this.breakpointObserver
    .observe(['(prefers-color-scheme: dark)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.systemTheme = Themes.Dark;
      } else {
        this.systemTheme = Themes.Light;
      }
    });
  }

  /**
  * Load the user context from the user context service 
  */
  private loadUserContext() {
    this.userContextService.getUserContextSubject().subscribe(data => {
      this.userContext = data;
    })
  }
}

