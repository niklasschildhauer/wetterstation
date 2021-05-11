import { Injectable } from '@angular/core';
import { UserContext, Themes } from '../model/user-context';
import { Observable, of } from 'rxjs';
import { USERCONTEXT } from '../model/mock-data/user-context.mock';


@Injectable({
  providedIn: 'root'
})
export class UserContextService {
  userContext: UserContext = USERCONTEXT; // FIXME

  constructor() { 
    this.loadUserContext()
  }

  loadUserContext() {
    this.userContext = USERCONTEXT;
  }

  login(): Promise<UserContext> {
    this.userContext.reduceMotion = true;
    this.userContext.theme = Themes.Dark;
    this.userContext.fontSize = 80;

    return new Promise((resolve) => {
      resolve(this.userContext);
    })
  }

  getFontSizePreference(): Observable<number> {
    const fontSize = of(this.userContext.fontSize);
    console.log(" font");

    return fontSize;
  }

  setFontSizePreference(fontSize: number) {
    console.log("increase font");
    this.userContext.fontSize = fontSize;
    console.log("font changes");
  }

  getMotionPreference(): Observable<boolean> {
    const reduceMotion = of(this.userContext.reduceMotion);
    return reduceMotion;
  }

  setMotionPreference(newValue: boolean) {
    this.userContext.reduceMotion = newValue;
  }

  setThemePreference(newValue: Themes) {
    this.userContext.theme = newValue;
  }

  getThemePreference(): Observable<Themes> {
    const theme = of(this.userContext.theme);
    return theme;
  }

  getUserContext(): Observable<UserContext> {
    const userContext = of(this.userContext);
    return userContext;
  }

  setSelfVoicingPreference(newValue: boolean) {
    this.userContext.selfVoicingEnabled = newValue;
  }

  setVentilationReminderPreference(newValue: boolean) {
    this.userContext.doVentilationReminder = newValue;
  }

}
