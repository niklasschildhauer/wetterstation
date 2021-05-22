import { Injectable } from '@angular/core';
import { UserContext, Themes, INITIAL_USER_CONTEXT, Pollen } from '../model/user-context';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { WeatherDataService } from './weather-data.service';

export interface UserContextDelegte {
  updatedUserContext(from: UserContextService): void
}

@Injectable({
  providedIn: 'root'
})
export class UserContextService {
  public delegate?: UserContextDelegte
  _userContext: UserContext; // FIXME
  set userContext(object: UserContext) {
    this._userContext = object
    this.saveUserContext()
  }
  get theme() {
    return this._userContext.theme
  }
  set theme(value: Themes) {
    this._userContext.theme = value;
    this.saveUserContext()
  }
  set reduceMotion(value: boolean) {
    this._userContext.reduceMotion = value
    this.saveUserContext()
  }
  set selfVoicingEnabled(value: boolean) {
    this._userContext.selfVoicingEnabled = value
    this.saveUserContext()
  }
  set doVentilationReminder(value: boolean) {
    this._userContext.doVentilationReminder = value
    this.saveUserContext()
  }
  set fontSize(value: number) {
    this._userContext.fontSize = value
    this.saveUserContext()
  }
  set pollen(value: Pollen[]) {
    this._userContext.pollen = value
    this.saveUserContext()
  }
  get pollen() {
    return this._userContext.pollen
  }

  constructor(private localStorageService: LocalStorageService,
    private router: Router) { 
    this._userContext = this.localStorageService.getUserContext();
  }
  
  login(): Promise<UserContext> {
    this.resetUserContext()
    // DELETE ME
    this.reduceMotion = true;
    this.theme = Themes.Dark;
    // this.fontSize = 80;
    return new Promise((resolve) => {
      resolve(this._userContext);
    });
  }

  logout() {
    this.resetUserContext();
    this.router.navigateByUrl('/onboarding/login'); //FIXME
  }

  register(): Promise<UserContext> {
    this.resetUserContext();
    console.log(INITIAL_USER_CONTEXT);
    return new Promise((resolve) => {
      resolve(this._userContext);
    });
  }

  getUserContext(): Observable<UserContext> {
    const userContext = of(this._userContext);
    return userContext;
  }

  private resetUserContext() {
    this._userContext.doVentilationReminder = INITIAL_USER_CONTEXT.doVentilationReminder
    this._userContext.pollen = INITIAL_USER_CONTEXT.pollen
    this._userContext.fontSize = INITIAL_USER_CONTEXT.fontSize
    this._userContext.language = INITIAL_USER_CONTEXT.language
    this._userContext.recordingFrequency = INITIAL_USER_CONTEXT.recordingFrequency
    this._userContext.reduceMotion = INITIAL_USER_CONTEXT.reduceMotion
    this._userContext.selfVoicingEnabled = INITIAL_USER_CONTEXT.selfVoicingEnabled
    this._userContext.theme = INITIAL_USER_CONTEXT.theme
    this.saveUserContext();
  }

  private saveUserContext() {
    this.saveUserContextToLocalStorage()
    this.delegate?.updatedUserContext(this);
  }

  private saveUserContextToLocalStorage() {
    this.localStorageService.saveUserContext(this._userContext)
  }
}
