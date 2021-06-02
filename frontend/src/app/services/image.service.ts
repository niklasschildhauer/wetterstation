import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Themes, UserContext } from '../model/user-context';
import { UserContextService } from './user-context.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private _userContext?: UserContext
  private _systemTheme = Themes.Light
  private _baseURL = "assets/icons/"

  constructor(private userContextService: UserContextService,
    private breakpointObserver: BreakpointObserver) { 
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
          return this._baseURL + imageModel.dark;
        } else {
          return this._baseURL + imageModel.light;
        }
      case Themes.Dark: 
        return this._baseURL + imageModel.dark;
      case Themes.Light: 
        return this._baseURL + imageModel.light;
      case Themes.HighContrast: 
        return imageModel.highContrast ? this._baseURL + imageModel.highContrast : this._baseURL + imageModel.dark;
      default: return ""
    }
  }
}

export interface ImageModel {
  dark: string,
  light: string,
  highContrast?: string
}
