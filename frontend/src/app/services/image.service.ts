import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { ImageModel } from '../model/image';
import { Themes, UserContext } from '../model/user-context';
import { Daytime, WeatherType } from '../model/weather';
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
   * Use this function to get the current background gradient
   * suiteable for the current weahther and daytime.
   * 
   * @param {weather} string  the current weather string
   * @returns The full assets path of the image
   */
  public getGradientStyleFor(weather: WeatherType | undefined): { background: string, filter: string }  {
    switch (weather) {
      case WeatherType.cloudy:
      case WeatherType.rainy:
      case WeatherType.windy: {
        switch (this.getDaytime()) {
          case Daytime.noon: return Gradients.noonDark
          case Daytime.dawn: return Gradients.dawnDark
          case Daytime.night: return Gradients.nightDark
        }
      }
      default: {
        switch (this.getDaytime()) {
          case Daytime.noon: return Gradients.noon
          case Daytime.dawn: return Gradients.dawn
          case Daytime.night: return Gradients.night
        }
      }
    }
  }

  /**
   * Use this function to get the image src of the current weather icon
   * 
   * @param {weather} WeatherType  the current weather
   * @returns The full assets path of the image
   */
   public getWeatherIconString(weather: WeatherType | undefined): string | undefined {
    let src = this.baseURLWeather;
    if(weather !== undefined) {
      let weatherString = WeatherType[weather];
      return src + weatherString + '.png'
    } else {
      return undefined
    }
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
  * Returns the current daytime
  */
  private getDaytime(): Daytime {
    const date = new Date();
    const dayHour = date.getHours();
    if(dayHour < 6){
      return Daytime.night;
    } 
    if (dayHour < 18) {
      return Daytime.noon;
    }
    if(dayHour < 21) {
      return Daytime.dawn;
    }
    return Daytime.night;
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

const Gradients = {
  noon: {
    background: 'linear-gradient(0deg, rgba(97,194,216,1) 0%, rgba(67,125,219,1) 100%)',
    filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#61c2d8",endColorstr="#437ddb",GradientType=1)'
  },
  dawn: {
    background: 'linear-gradient(0deg, rgba(238,69,59,1) 0%, rgba(164,9,110,1) 100%)',
    filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#ee453b",endColorstr="#a4096e",GradientType=1)'
  },
  night: {
    background: 'linear-gradient(0deg, rgba(216,97,204,1) 0%, rgba(70,67,219,1) 100%)',
    filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#d861cc",endColorstr="#4643db",GradientType=1)'
  },
  noonDark: {
    background: 'linear-gradient(170deg, rgba(20,27,87,1) 0%, rgba(151,208,255,1) 100%)',
    filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#61c2d8",endColorstr="#437ddb",GradientType=1)'
  },
  dawnDark: {
    background: 'linear-gradient(170deg, rgba(212,108,102,1) 0%, rgba(108,10,72,1) 100%)',
    filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#ee453b",endColorstr="#a4096e",GradientType=1)'
  },
  nightDark: {
    background: 'linear-gradient(170deg, rgba(119,48,112,1) 0%, rgba(152,152,191,1) 100%)',
    filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#d861cc",endColorstr="#4643db",GradientType=1)'
  }
}
