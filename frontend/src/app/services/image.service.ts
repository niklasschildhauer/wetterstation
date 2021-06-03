import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Themes, UserContext } from '../model/user-context';
import { Daytime } from '../model/weather';
import { UserContextService } from './user-context.service';
import { WeatherAPIService } from './weather-api.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private _userContext?: UserContext
  private _systemTheme = Themes.Light
  private _baseURLIcons = "assets/icons/"
  private _baseURLWeather = "assets/weather/"

  constructor(private userContextService: UserContextService,
    private breakpointObserver: BreakpointObserver,
    private weatherAPI: WeatherAPIService) { 
    this.loadUserContext()
    this.systemThemeBreakpointObserver()
  }

  private systemThemeBreakpointObserver() {
    this.breakpointObserver
    .observe(['(prefers-color-scheme: dark)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this._systemTheme = Themes.Dark;
      } else {
        this._systemTheme = Themes.Light;
      }
    });
  }

  private loadUserContext() {
    this.userContextService.getUserContext().subscribe(data => {
      this._userContext = data;
    })
  }

  getImageSrcFrom(imageModel: ImageModel): string {
    let userContextTheme = this._userContext?.theme
    switch(userContextTheme) {
      case Themes.Automatic: 
        if(this._systemTheme == Themes.Dark) {
          return this._baseURLIcons + imageModel.dark;
        } else {
          return this._baseURLIcons + imageModel.light;
        }
      case Themes.Dark: 
        return this._baseURLIcons + imageModel.dark;
      case Themes.Light: 
        return this._baseURLIcons + imageModel.light;
      case Themes.HighContrast: 
        return imageModel.highContrast ? this._baseURLIcons + imageModel.highContrast : this._baseURLIcons + imageModel.dark;
      default: return ""
    }
  }

  getWeatherIconString(weather: string): string {
    let src = this._baseURLWeather;
    switch (this.weatherAPI.getDaytime()) {
      case Daytime.night: {
        src = src + "night/" + weather + ".png";
        break;
      }
      default: {
        src = src + "day/" + weather + ".png";
      }
    }
    return src
  }
}

export interface ImageModel {
  dark: string,
  light: string,
  highContrast?: string
}
