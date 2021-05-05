import { Injectable } from '@angular/core';
import { UserContext, Themes } from '../model/user-context';
import { Observable, of } from 'rxjs';
import { USERCONTEXT } from '../model/mock-data/user-context.mock';


@Injectable({
  providedIn: 'root'
})
export class UserContextService {

  constructor() { }

  getFontSizePreference(): Observable<number> {
    const fontSize = of(USERCONTEXT.fontSize);
    console.log(" font");

    return fontSize;
  }

  setFontSizePreference(fontSize: number) {
    console.log("increase font");
    USERCONTEXT.fontSize = fontSize;
    console.log("font changes");
  }

  getMotionPreference(): Observable<boolean> {
    const reduceMotion = of(USERCONTEXT.reduceMotion);
    return reduceMotion;
  }

  setMotionPreference(newValue: boolean) {
    USERCONTEXT.reduceMotion = newValue;
  }

  setThemePreference(newValue: Themes) {
    USERCONTEXT.theme = newValue;
  }

  getThemePreference(): Observable<Themes> {
    const theme = of(USERCONTEXT.theme);
    return theme;
  }

  getUserContext(): Observable<UserContext> {
    const userContext = of(USERCONTEXT);
    return userContext;
  }

  setSelfVoicingPreference(newValue: boolean) {
    USERCONTEXT.selfVoicingEnabled = newValue;
  }

  setVentilationReminderPreference(newValue: boolean) {
    USERCONTEXT.doVentilationReminder = newValue;
  }

}
