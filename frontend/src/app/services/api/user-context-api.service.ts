import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { INITIAL_USER_CONTEXT, PollenType, Themes, UserContext } from '../../model/user-context';

@Injectable({
  providedIn: 'root'
})
export class UserContextAPIService {
  private loginURL = '/auth/login';
  private registerURL = '/user/register';
  private checkTokenURL = '/auth/checkToken';
  private currentUserContextURL = '/user/currentUser';
  private saveUserContextURL = '/user/save';
  private allPollenTypesURL = '/pollen/all';

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
        observer.error("Ein Fehler ist aufgetreten. Bitte versuche es später erneut. ");
        console.log(error);
        observer.complete();
      },() => {
        observer.complete();
      });
    }
  );
  return returnObservable;
  }


  public postRegister(password: string, username: string): Observable<{success: boolean, error: string}> {
    let returnObservable = new Observable<{success: boolean, error: string}>((observer) => {
      let response = this.httpClient.post<UserContextResponse>(this.registerURL, 
                                                              {username: username, password: password}, {observe: 'response'});
      response.subscribe((response) => {
        let body = response.body
        let status = response.statusText
        console.log(status);

        if(body){
          if(body.id) {
            observer.next({success: true, error: ""});
          } else {
            observer.error("Ein Fehler ist aufgetreten. Bitte versuche es später erneut");
          }
        }
      },
      (error)=> {
        observer.error("Ein Fehler ist aufgetreten. Bitte versuche es später erneut");
        console.log(error);
        observer.complete();
      },
      () => {
        observer.complete();
      });
    }
  );
  return returnObservable;
  }

  public postSaveUserContext(userContext: UserContext): Observable<{success: boolean, error: string}>{
    let returnObservable = new Observable<{success: boolean, error: string}>((observer) => {
      let response = this.httpClient.post<UserContextResponse>(this.saveUserContextURL, 
                                                              userContext, {observe: 'response'});
      response.subscribe((response) => {
        let body = response.body
        let status = response.statusText
        console.log(status);

        if(body){
          if(body.id) {
            observer.next({success: true, error: ""});
          } else {
            observer.error("Ein Fehler ist aufgetreten.");
          }
        }
      },
      (error)=> {
        observer.error("Ein Fehler ist aufgetreten.");
        console.log(error);
        observer.complete();
      }, 
      () => {
        observer.complete();
      });
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

  public loadUserContext(token: string): Observable<UserContext>{
    let returnObservable = new Observable<UserContext>((observer) => {
      let httpOptions = {
        headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token })
      };
      let response = this.httpClient.get<{userContext: UserContextResponse}>(this.currentUserContextURL, httpOptions);
      response.subscribe(data => {
        console.log(this.createUserContextFromServerResponse(data.userContext));
        observer.next(this.createUserContextFromServerResponse(data.userContext));
        observer.complete();
      }, 
      () => {
        observer.error("An error occured")
        observer.complete();
      })
    });
    return returnObservable;
  }

  public loadPollenTypes(): Observable<PollenType[]>{
    let returnObservable = new Observable<PollenType[]>((observer) => {
      let response = this.httpClient.get<PollenType[]>(this.allPollenTypesURL);
      response.subscribe(data => {
        observer.next(data);
      });
    });
    return returnObservable
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

