import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { INITIAL_USER_CONTEXT, PollenType, Themes, UserContext } from '../model/user-context';

@Injectable({
  providedIn: 'root'
})
export class UserContextApiService {
  private loginURL = '/auth/login'
  private checkTokenURL = '/auth/checkToken'
  private allPollenTypesURL = '/pollen/all'

  constructor(private httpClient: HttpClient) { }

  public postLogin(password: string, username: string): Observable<{token: string, userContext: UserContext}> {
    let returnObservable = new Observable<{token: string, userContext: UserContext}>((observer) => {
      let response = this.httpClient.post<LoginResponse>(this.loginURL, 
                                                        {username: username, password: password}, {observe: 'response'});
      response.subscribe((response) => {
        let body = response.body
        let status = response.statusText
        console.log(status);

        if(body){
            if(body.success) {
              console.log(this.createUserContextFromServerResponse(body.userContext));
              observer.next({
                token: body.token,
                userContext: this.createUserContextFromServerResponse(body.userContext) // FIXME
              });
            } else {
              observer.error(body.message);
            }
          }
        },
        (error)=> {
          observer.error("Ein Fehler ist aufgetreten. Bitte versuche es später erneut.");
        },() => {
          observer.complete();
        }

      );
    }
  );
  return returnObservable;
  }

  public loadPollenTypes(): Observable<PollenType[]>{
    let returnObservable = new Observable<PollenType[]>((observer) => {
      let response = this.httpClient.get<PollenType[]>(this.allPollenTypesURL);
      response.subscribe(data => {
        observer.next(data);
        observer.complete();
      })
    });
    return returnObservable;
  }

  public postIsTokenValid(token: string): Observable<boolean> {
    let returnObservable = new Observable<boolean>((observer) => {
      let httpOptions = {
        headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token })
      };

      console.log(httpOptions);
      let response = this.httpClient.get<CheckTokenResponse>(this.checkTokenURL, httpOptions);
      response.subscribe(data => {
        observer.next(data.success);
        observer.complete();
      }, 
      () => {
        observer.next(false);
        observer.complete();
      })
    });
    return returnObservable;
  }

  private createUserContextFromServerResponse(userContext: UserContextResponse): UserContext {
    return {
      theme: this.getThemeTypeFromServerResponse(userContext.theme),
      fontSize: userContext.fontSize * 3.90,
      pollen: userContext.pollen, 
      doVentilationReminder: userContext.doVentilationReminder,
      reduceMotion: userContext.reduceMotion,
      selfVoicingEnabled: userContext.selfVoicingEnabled
    }
  }

  private getThemeTypeFromServerResponse(theme: string): Themes {
    switch(theme) {
      case "dark": return Themes.Dark;
      case "light": return Themes.Light;
      case "highContrast": return Themes.HighContrast;
      default: return Themes.Automatic;
    }
  }

  private createThemeTypeForServerRequest(theme: Themes) {
    switch(theme) {
      case Themes.Dark: return "dark";
      case Themes.Light: return "light";
      case Themes.HighContrast: return "highContrast";
      default: return "automatic";
    }
  }
}


interface LoginResponse {
  success: boolean,
  message: string,
  userContext: UserContextResponse,
  token: string,
}

interface UserContextResponse {
  id: number,
  username: string,
  theme: string,
  fontSize: number,
  selfVoicingEnabled: boolean,
  doVentilationReminder: boolean,
  reduceMotion: boolean,
  pollen: string[]
}

interface CheckTokenResponse {
  success: boolean,
  message: string,
}

