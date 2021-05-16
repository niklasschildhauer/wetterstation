import { Injectable } from '@angular/core';
import { UserContext, Themes, INITIAL_USER_CONTEXT, Pollen } from '../model/user-context';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { TileService } from './tile.service';


@Injectable({
  providedIn: 'root'
})
export class UserContextService {
  _userContext: UserContext; // FIXME
  set userContext(object: UserContext) {
    this._userContext = object
    this.saveUserContextToLocalStorage()
  }
  get theme() {
    return this._userContext.theme
  }
  set theme(value: Themes) {
    this._userContext.theme = value;
    this.saveUserContextToLocalStorage()
  }
  set reduceMotion(value: boolean) {
    this._userContext.reduceMotion = value
    this.saveUserContextToLocalStorage()
  }
  set selfVoicingEnabled(value: boolean) {
    this._userContext.selfVoicingEnabled = value
    this.saveUserContextToLocalStorage()
  }
  set doVentilationReminder(value: boolean) {
    this._userContext.doVentilationReminder = value
    this.saveUserContextToLocalStorage()
  }
  set fontSize(value: number) {
    this._userContext.fontSize = value
    this.saveUserContextToLocalStorage()
  }
  set pollen(value: Pollen[]) {
    this._userContext.pollen = value
    this.saveUserContextToLocalStorage()

  }
  get pollen() {
    return this._userContext.pollen
  }

  constructor(private localStorageService: LocalStorageService) { 
    this._userContext = this.localStorageService.getUserContext();
  }
  
  login(): Promise<UserContext> {
    // DELETE ME
    this.reduceMotion = true;
    this.theme = Themes.Dark;
    // this.fontSize = 80;
    return new Promise((resolve) => {
      resolve(this._userContext);
    });
  }

  logout() {
    console.log("Reset user context");
    this.userContext = INITIAL_USER_CONTEXT;
  }

  register(): Promise<UserContext> {
    this.userContext = INITIAL_USER_CONTEXT;
    console.log(INITIAL_USER_CONTEXT);
    return new Promise((resolve) => {
      resolve(this._userContext);
    });
  }

  getUserContext(): Observable<UserContext> {
    const userContext = of(this._userContext);
    return userContext;
  }

  saveUserContextToLocalStorage() {
    this.localStorageService.saveUserContext(this._userContext)
  }
}
